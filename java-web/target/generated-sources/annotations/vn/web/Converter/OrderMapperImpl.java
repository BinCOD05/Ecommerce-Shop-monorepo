package vn.web.Converter;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.web.Controller.Response.OrderItemResponse;
import vn.web.Controller.Response.OrderResponse;
import vn.web.Model.Order;
import vn.web.Model.OrderItem;
import vn.web.Model.Product;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-29T14:22:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderResponse toDTOResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponse orderResponse = new OrderResponse();

        orderResponse.setNote( order.getNote() );
        orderResponse.setName( order.getName() );
        orderResponse.setPhoneNumber( order.getPhoneNumber() );
        orderResponse.setId( order.getId() );
        orderResponse.setCode( order.getCode() );
        if ( order.getStatus() != null ) {
            orderResponse.setStatus( order.getStatus().name() );
        }
        orderResponse.setOrderDate( order.getOrderDate() );
        orderResponse.setTotalPrice( order.getTotalPrice() );
        orderResponse.setOrderItems( orderItemListToOrderItemResponseList( order.getOrderItems() ) );

        orderResponse.setAddress( buildAddress(order) );

        return orderResponse;
    }

    @Override
    public OrderItemResponse toItemResponse(OrderItem item) {
        if ( item == null ) {
            return null;
        }

        OrderItemResponse orderItemResponse = new OrderItemResponse();

        orderItemResponse.setProductName( itemProductName( item ) );
        orderItemResponse.setImei( item.getImei() );
        orderItemResponse.setId( item.getId() );
        orderItemResponse.setQuantity( item.getQuantity() );
        orderItemResponse.setPrice( item.getPrice() );

        orderItemResponse.setProductImage( getPrimaryImage(item) );

        return orderItemResponse;
    }

    protected List<OrderItemResponse> orderItemListToOrderItemResponseList(List<OrderItem> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderItemResponse> list1 = new ArrayList<OrderItemResponse>( list.size() );
        for ( OrderItem orderItem : list ) {
            list1.add( toItemResponse( orderItem ) );
        }

        return list1;
    }

    private String itemProductName(OrderItem orderItem) {
        if ( orderItem == null ) {
            return null;
        }
        Product product = orderItem.getProduct();
        if ( product == null ) {
            return null;
        }
        String name = product.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
