package vn.web.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "product")
@Setter
@Getter
public class Product extends AbstractEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id ;

    @Column(name = "name")
    private String name ;

    @Column(name = "price" , precision = 10 , scale = 2)
    private BigDecimal price ;

    @Column(name = "color")
    private String color ;

    @Column(name = "storage")
    private String storage ;

    @Column(name = "description")
    private String description ;

    @Column(name = "is_active")
    private Boolean active = true;

    @OneToMany(mappedBy = "product")
    private Set<CartItem> cartItemSet;

    @OneToMany(mappedBy = "product")
    private List<Review> reviewList ;

    @OneToMany(mappedBy = "product" , cascade = CascadeType.ALL , orphanRemoval = true)
    private Set<ProductImage> productImages = new HashSet<>();

    @OneToMany(mappedBy = "product" , cascade = CascadeType.ALL , orphanRemoval = true)
    private Set<ProductSpecs> productSpecs = new HashSet<>();


    @OneToOne(mappedBy = "product" , cascade = CascadeType.ALL , orphanRemoval = true)
    private Inventory inventory;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;


    @Column(name = "warranty_period")
    private Integer warrantyPeriod;

    public void setProductImages(Set<ProductImage> productImages){
        this.productImages = productImages;
        if(productImages != null ){
            for (ProductImage productImage : productImages){
                productImage.setProduct(this);
            }
        }
    }

    public void setProductSpecs(Set<ProductSpecs> productSpecs){
        this.productSpecs = productSpecs;
        if(productSpecs != null ){
            for (ProductSpecs productSpecs1 : productSpecs){
                productSpecs1.setProduct(this);
            }
        }
    }


}
