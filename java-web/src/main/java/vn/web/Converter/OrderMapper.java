package vn.web.Converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.web.Controller.Response.OrderItemResponse;
import vn.web.Controller.Response.OrderResponse;
import vn.web.Model.Order;
import vn.web.Model.OrderItem;
import vn.web.Model.ProductImage;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "address",     expression = "java(buildAddress(order))")
    @Mapping(target = "note",        source = "note")
    @Mapping(target = "name",        source = "name")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    OrderResponse toDTOResponse(Order order);

    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "imei",         target = "imei")
    @Mapping(target = "productImage", expression = "java(getPrimaryImage(item))")
    OrderItemResponse toItemResponse(OrderItem item);

    /** Format chuỗi địa chỉ: line1, ward, district, city */
    default String buildAddress(Order order) {
        if (order == null) return "";
        StringBuilder sb = new StringBuilder();
        appendIfNotBlank(sb, order.getShipLine1());
        appendIfNotBlank(sb, order.getShipWard());
        appendIfNotBlank(sb, order.getShipDistrict());
        appendIfNotBlank(sb, order.getShipCity());
        return sb.toString();
    }

    /** Lấy URL ảnh primary của sản phẩm trong order item */
    default String getPrimaryImage(OrderItem item) {
        if (item == null || item.getProduct() == null) return null;
        return item.getProduct().getProductImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getPrimary()))
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(item.getProduct().getProductImages().stream()
                        .findFirst()
                        .map(ProductImage::getImageUrl)
                        .orElse(null));
    }

    private static void appendIfNotBlank(StringBuilder sb, String part) {
        if (part != null && !part.isBlank()) {
            if (!sb.isEmpty()) sb.append(", ");
            sb.append(part.trim());
        }
    }
}
