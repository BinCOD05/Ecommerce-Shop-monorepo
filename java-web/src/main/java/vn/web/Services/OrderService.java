package vn.web.Services;

import vn.web.Controller.Request.OrderRequest;
import vn.web.Controller.Response.OrderResponse;

import java.util.List;


public interface OrderService {

    OrderResponse createOrder(OrderRequest req);

    List<OrderResponse> getMyOrders();

    OrderResponse getOrderById(Long orderId);

    List<OrderResponse> getAllOrdersForAdmin();

    OrderResponse updateOrderStatus(Long orderId, String newStatus);

    void inputImei(Long orderItemId, String imeiCode);

    String checkWarranty(String imeiInput);
}