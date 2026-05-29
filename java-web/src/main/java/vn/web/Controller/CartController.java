package vn.web.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.web.Controller.Request.AddCartRequest;
import vn.web.Controller.Request.UpdateCartRequest;
import vn.web.Controller.Response.ApiResponse;
import vn.web.Controller.Response.CartResponse;
import vn.web.Services.CartService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private  final CartService cartService ;

    @PostMapping
    public ApiResponse<Object> addToCart(@RequestBody AddCartRequest request){
        cartService.addToCart(request);
        return  null ;
    }

    @GetMapping
    public  ApiResponse<CartResponse> getCartList(){
        return ApiResponse.<CartResponse>builder()
                .result(cartService.getCartList())
        .build();
    }
    @PutMapping(value = "/items/{itemId}")
    public  ApiResponse<CartResponse> updateQuantityCartItem(@PathVariable Long itemId ,
                                                             @RequestBody UpdateCartRequest quantity){
        return ApiResponse.<CartResponse>builder()
                .result(cartService.updateQuantity(quantity.getQuantity() , itemId))
                .build();
    }


    @PatchMapping(value = "/items/{itemId}/select")
    public ApiResponse<CartResponse> selectCartItem(@PathVariable Long itemId ,
                                                    @RequestBody Map<String , Boolean> request){

        return  ApiResponse.<CartResponse>builder()
                .result(cartService.selectCartItem(request.get("selected") , itemId))
                .build();
    }

    @DeleteMapping(value = "/items/{itemId}")
    public ApiResponse<CartResponse> deleteCartItem(@PathVariable Long itemId){
        return ApiResponse.<CartResponse>builder()
                .result(cartService.delete(itemId))
                .build();
    }
}
