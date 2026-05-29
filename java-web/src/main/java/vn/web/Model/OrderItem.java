package vn.web.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@Table(name = "order_item")
public class OrderItem implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order ;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product ;


    @Column(name = "price" , precision = 10 , scale = 2)
    private BigDecimal price ;

    @Column(name = "quantity")
    private Long quantity  ;


    @Column(name = "imei")
    private String imei;


    @Column(name = "warranty_end_date")
    private LocalDateTime warrantyEndDate;

}
