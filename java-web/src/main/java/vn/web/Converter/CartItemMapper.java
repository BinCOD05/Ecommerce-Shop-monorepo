package vn.web.Converter;

import org.springframework.stereotype.Component;
import vn.web.Controller.Response.CartItemResponse;
import vn.web.Model.CartItem;
import vn.web.Model.ProductImage;

import java.util.Comparator;
import java.util.Set;

@Component
public class CartItemMapper {

        public CartItemResponse toDTOResponse(CartItem cartItem) {
                CartItemResponse response = new CartItemResponse();

                response.setId(cartItem.getId());
                response.setProductId(cartItem.getProduct().getId());
                response.setProductName(cartItem.getProduct().getName());
                response.setColor(cartItem.getProduct().getColor()); // Nếu có
                response.setPrice(cartItem.getProduct().getPrice());
                response.setQuantity(cartItem.getQuantity());
                response.setSelected(cartItem.getSelected());

                // --- ĐOẠN LOGIC LẤY ẢNH ---
                Set<ProductImage> images = cartItem.getProduct().getProductImages();
                if (images != null && !images.isEmpty()) {
                        String firstImage = images.stream()
                                .findFirst()
                                .map(ProductImage::getImageUrl) // Giả sử getter là getImageUrl
                                .orElse(null);

                        response.setProductImage(firstImage);
                }
                // ---------------------------

                // Set max stock để frontend validation (nếu cần)
                if (cartItem.getProduct().getInventory() != null) {
                        response.setMaxStock(cartItem.getProduct().getInventory().getQuantity());
                }

                return response;
        }
}