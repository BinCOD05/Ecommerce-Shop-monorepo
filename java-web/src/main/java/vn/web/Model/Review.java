package vn.web.Model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
@Entity
@Table(name = "review")
public class Review extends AbstractEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product ;

    @Column(name = "rating")
    private Long rating ;

    @Column(name = "content")
    private String content ;

    @Column(name = "is_approved")
    private Boolean approved ;

}
