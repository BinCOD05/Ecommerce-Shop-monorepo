package vn.web.Services;


import vn.web.Controller.Request.AddCartRequest;
import vn.web.Controller.Response.CartResponse;

public interface CartService {

    Object addToCart(AddCartRequest req);

    CartResponse getCartList();

    CartResponse updateQuantity(Long quantity , Long itemId);

    CartResponse selectCartItem(Boolean selected , Long itemId);

    CartResponse delete(Long itemId);

}
