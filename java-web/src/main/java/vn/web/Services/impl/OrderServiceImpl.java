package vn.web.Services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.web.Common.OrderStatus;
import vn.web.Controller.Request.OrderRequest;
import vn.web.Controller.Response.OrderResponse;
import vn.web.Converter.OrderMapper;
import vn.web.Exception.ResourceNotFoundException;
import vn.web.Model.*;
import vn.web.Repository.*;
import vn.web.Services.OrderService;
import vn.web.Util.SecurityUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;
    private final VoucherRepository voucherRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest req) {
        UserEntity currentUser = SecurityUtils.requireCurrentUser();
        UserEntity user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        AddressEntity address = addressRepository.findByIdAndUserId(req.getAddressId(), currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Địa chỉ không hợp lệ hoặc không thuộc về bạn"));

        List<CartItem> cartItems = cartItemRepository.findAllById(req.getCartItemIds());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống hoặc sản phẩm không hợp lệ");
        }

        // Kiểm tra tất cả cart item thuộc về user hiện tại
        boolean allBelongToUser = cartItems.stream()
                .allMatch(ci -> ci.getCart().getUser().getId().equals(currentUser.getId()));
        if (!allBelongToUser) {
            throw new RuntimeException("Cart item không hợp lệ");
        }

        Order order = new Order();
        order.setUser(user);

        // Lấy thông tin người nhận từ địa chỉ (không phải từ tài khoản user)
        order.setName(address.getRecipient() != null ? address.getRecipient() : user.getFullName());
        order.setPhoneNumber(address.getPhone() != null ? address.getPhone() : user.getPhone());
        order.setNote(req.getNote());

        // Lưu đầy đủ thông tin địa chỉ giao hàng
        order.setShipLine1(address.getLine1());
        order.setShipLine2(address.getLine2());
        order.setShipWard(address.getWard());
        order.setShipDistrict(address.getDistrict());
        order.setShipCity(address.getCity());

        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            Inventory inventory = product.getInventory();

            if (inventory == null) {
                throw new RuntimeException("Sản phẩm \"" + product.getName() + "\" chưa được thiết lập kho hàng");
            }

            long stock = inventory.getQuantity() != null ? inventory.getQuantity() : 0L;
            long qty = cartItem.getQuantity();

            if (stock < qty) {
                throw new RuntimeException("Sản phẩm \"" + product.getName() + "\" không đủ hàng (Còn: " + stock + ")");
            }

            inventory.setQuantity(stock - qty);

            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(qty);
            orderItem.setProduct(product);
            orderItem.setOrder(order);
            orderItem.setPrice(product.getPrice());
            orderItems.add(orderItem);

            totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(qty)));
        }

        // Áp dụng voucher
        if (req.getVoucherCode() != null && !req.getVoucherCode().isBlank()) {
            Voucher voucher = voucherRepository.findByCode(req.getVoucherCode())
                    .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

            if (voucher.getQuantity() <= 0) {
                throw new RuntimeException("Mã giảm giá đã hết lượt sử dụng");
            }
            if (voucher.getExpirationDate() != null && LocalDateTime.now().isAfter(voucher.getExpirationDate())) {
                throw new RuntimeException("Mã giảm giá đã hết hạn");
            }

            totalPrice = totalPrice.subtract(voucher.getDiscountAmount()).max(BigDecimal.ZERO);
            voucher.setQuantity(voucher.getQuantity() - 1);
            voucherRepository.save(voucher);
        }

        order.setTotalPrice(totalPrice);
        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteAll(cartItems);

        return orderMapper.toDTOResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getMyOrders() {
        long userId = SecurityUtils.getCurrentId();
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(orderMapper::toDTOResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        long currentId = SecurityUtils.getCurrentId();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng: " + orderId));

        // Chỉ cho phép xem đơn của chính mình (admin sẽ dùng endpoint riêng)
        if (!order.getUser().getId().equals(currentId)) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này");
        }

        return orderMapper.toDTOResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrdersForAdmin() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate")).stream()
                .map(orderMapper::toDTOResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại: " + orderId));

        OrderStatus newStatusEnum;
        try {
            newStatusEnum = OrderStatus.valueOf(newStatus.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Trạng thái không hợp lệ: " + newStatus);
        }

        if (newStatusEnum == order.getStatus()) {
            return orderMapper.toDTOResponse(order);
        }

        // Hoàn kho khi hủy đơn (trừ đơn đã giao)
        if (newStatusEnum == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.DELIVERED) {
            order.getOrderItems().forEach(item -> {
                Inventory inv = item.getProduct().getInventory();
                if (inv != null) {
                    long cur = inv.getQuantity() != null ? inv.getQuantity() : 0L;
                    inv.setQuantity(cur + item.getQuantity());
                }
            });
        }

        // Kích hoạt bảo hành khi giao thành công
        if (newStatusEnum == OrderStatus.DELIVERED) {
            LocalDateTime now = LocalDateTime.now();
            order.getOrderItems().forEach(item -> {
                int months = (item.getProduct().getWarrantyPeriod() != null)
                        ? item.getProduct().getWarrantyPeriod()
                        : 12;
                item.setWarrantyEndDate(now.plusMonths(months));
            });
            orderItemRepository.saveAll(order.getOrderItems());
        }

        order.setStatus(newStatusEnum);
        return orderMapper.toDTOResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public void inputImei(Long orderItemId, String imeiCode) {
        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy order item: " + orderItemId));
        item.setImei(imeiCode);
        orderItemRepository.save(item);
    }

    @Override
    public String checkWarranty(String imei) {
        OrderItem item = orderItemRepository.findByImei(imei)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với IMEI: " + imei));

        if (item.getWarrantyEndDate() == null) {
            return "Sản phẩm chưa được kích hoạt bảo hành (đơn hàng chưa hoàn tất).";
        }

        Product product = item.getProduct();
        LocalDateTime now = LocalDateTime.now();
        String status = now.isBefore(item.getWarrantyEndDate()) ? "CÒN BẢO HÀNH" : "ĐÃ HẾT BẢO HÀNH";

        return "Sản phẩm: " + product.getName() + "\n"
                + "IMEI: " + item.getImei() + "\n"
                + "Trạng thái: " + status + "\n"
                + "Hết hạn: " + item.getWarrantyEndDate().toLocalDate();
    }
}
