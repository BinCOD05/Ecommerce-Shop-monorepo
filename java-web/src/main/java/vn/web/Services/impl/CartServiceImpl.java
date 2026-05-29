package vn.web.Services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.web.Controller.Request.AddCartRequest;
import vn.web.Controller.Response.CartItemResponse;
import vn.web.Controller.Response.CartResponse;
import vn.web.Converter.CartItemMapper;
import vn.web.Exception.ResourceNotFoundException;
import vn.web.Model.*;
import vn.web.Repository.CartItemRepository;
import vn.web.Repository.CartRepository;
import vn.web.Repository.ProductRepository;
import vn.web.Services.CartService;
import vn.web.Util.SecurityUtils;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartItemMapper cartItemMapper;

    @Override
    @Transactional
    public Object addToCart(AddCartRequest req) {
        UserEntity user = SecurityUtils.requireCurrentUser();

        Product product = productRepository.findByIdFullInfo(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm: " + req.getProductId()));

        Inventory inventory = product.getInventory();
        if (inventory == null) {
            throw new RuntimeException("Sản phẩm chưa được thiết lập kho hàng");
        }

        long stock = inventory.getQuantity();
        if (stock < req.getQuantity()) {
            throw new RuntimeException("Sản phẩm không đủ số lượng (Còn: " + stock + ")");
        }

        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        Optional<CartItem> existing = cart.getCartItemSet().stream()
                .filter(i -> i.getProduct().getId().equals(req.getProductId()))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            long newQty = item.getQuantity() + req.getQuantity();
            if (newQty > stock) {
                throw new RuntimeException("Vượt quá số lượng tồn kho (Còn: " + stock + ")");
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setQuantity(req.getQuantity());
            item.setProduct(product);
            cartItemRepository.save(item);
        }

        return null;
    }

    @Override
    @Transactional
    public CartResponse getCartList() {
        UserEntity user = SecurityUtils.requireCurrentUser();

        Optional<Cart> cartOpt = cartRepository.findByUserId(user.getId());
        if (cartOpt.isEmpty()) {
            // Trả về giỏ hàng trống thay vì throw exception
            return CartResponse.builder()
                    .id(null)
                    .totalItems(0L)
                    .totalPrice(BigDecimal.ZERO)
                    .cartItemResponses(Collections.emptyList())
                    .build();
        }

        Cart cart = cartOpt.get();
        List<CartItemResponse> items = cart.getCartItemSet().stream()
                .map(cartItemMapper::toDTOResponse)
                .collect(Collectors.toList());

        BigDecimal totalPrice = cart.getCartItemSet().stream()
                .filter(i -> Boolean.TRUE.equals(i.getSelected()))
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .totalItems((long) items.size())
                .totalPrice(totalPrice)
                .cartItemResponses(items)
                .build();
    }

    @Override
    @Transactional
    public CartResponse updateQuantity(Long quantity, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cart item: " + itemId));

        if (!item.getCart().getUser().getId().equals(SecurityUtils.getCurrentId())) {
            throw new RuntimeException("Bạn không có quyền thay đổi item này");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return getCartList();
        }

        long stock = item.getProduct().getInventory().getQuantity();
        if (quantity > stock) {
            throw new RuntimeException("Không đủ hàng trong kho (Còn: " + stock + ")");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return getCartList();
    }

    @Override
    @Transactional
    public CartResponse selectCartItem(Boolean selected, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cart item: " + itemId));

        if (!item.getCart().getUser().getId().equals(SecurityUtils.getCurrentId())) {
            throw new RuntimeException("Bạn không có quyền thay đổi item này");
        }

        item.setSelected(selected);
        cartItemRepository.save(item);
        return getCartList();
    }

    @Override
    @Transactional
    public CartResponse delete(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cart item: " + itemId));

        if (!item.getCart().getUser().getId().equals(SecurityUtils.requireCurrentUser().getId())) {
            throw new RuntimeException("Bạn không có quyền xóa item này");
        }

        cartItemRepository.delete(item);
        return getCartList();
    }
}
