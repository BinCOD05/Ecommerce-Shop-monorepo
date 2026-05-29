package vn.web.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;



@Entity
@Table(name = "cart_item")
@Getter
@Setter
public class CartItem extends AbstractEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id ;

    @Column(name = "quantity")
    private Long quantity ;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart ;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product ;

    @Column(name = "selected")
    private Boolean selected ;


    @Column(name = "unit_price_snapshot" , scale =  2  , precision =  10 )
    private BigDecimal unitPrice ;


}
