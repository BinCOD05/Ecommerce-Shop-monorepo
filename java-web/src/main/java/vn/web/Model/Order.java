package vn.web.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import vn.web.Common.OrderStatus;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order  implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "code" , unique = true , nullable = false)
    private  String code ;

    @Column(name = "note")
    private String note  ;

    @OneToMany(mappedBy = "order" , fetch = FetchType.EAGER , cascade = CascadeType.ALL , orphanRemoval = true)
    List<OrderItem> orderItems =  new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user ;

    @Column(name = "full_name")
    private String name ;

    @Column(name = "phone_number")
    private String phoneNumber ;

    @Column(name = "ship_line1")
    private String shipLine1 ;

    @Column(name = "ship_line2")
    private String shipLine2 ;

    @Column(name = "ship_city")
    private String shipCity ;

    @Column(name = "ship_district")
    private String shipDistrict  ;

    @Column(name = "ship_ward")
    private String shipWard ;

    @Column(name = "order_date")
    @CreationTimestamp
    private LocalDateTime orderDate ;

    // columnDefinition = VARCHAR để tránh MySQL ENUM tự giới hạn giá trị
    @Column(name = "status", columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    private OrderStatus status ;

    @Column(name = "total_price" , precision = 10 , scale = 2)
    private BigDecimal totalPrice ;


    @PrePersist
    public void generateOrderCode() {
        if (this.code == null) {
            this.code = "ORD-" + System.currentTimeMillis();
        }
        if (this.status == null) {
            this.status = OrderStatus.PENDING;
        }
    }


}
