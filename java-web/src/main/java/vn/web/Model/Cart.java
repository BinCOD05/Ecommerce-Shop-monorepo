package vn.web.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "cart")
@Getter
@Setter
public class Cart extends  AbstractEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id ;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user ;

    @OneToMany(mappedBy = "cart" , fetch = FetchType.LAZY , cascade = CascadeType.ALL , orphanRemoval = true)
    private Set<CartItem> cartItemSet = new HashSet<>();

    @Column(name = "status")
    private String status ;

}
