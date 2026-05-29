package vn.web.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Entity
@Table(name = "inventory")
@Getter
@Setter
public class Inventory extends AbstractEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "quantity")
    private Long quantity  ;

    @OneToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "safety_stock")
    private Integer safetyStock ;

}
