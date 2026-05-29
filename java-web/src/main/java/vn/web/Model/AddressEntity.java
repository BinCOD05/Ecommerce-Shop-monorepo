package vn.web.Model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.web.Common.AddressType;

import java.io.Serializable;


@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "address")
public class AddressEntity extends AbstractEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id ;

    @Column(name = "recipient")
    private String recipient ;

    @Column(name = "phone")
    private String phone ;

    @Column(name = "ward")
    private String ward ;

    @Column(name = "city")
    private String city ;

    @Column(name = "line1")
    private String line1 ;

    @Column(name = "line2")
    private String line2 ;

    @ManyToOne
    @JoinColumn(name = "userid")
    private UserEntity user ;

    @Column(name = "district")
    private String district;

    @Column(name = "address_type", columnDefinition = "VARCHAR(20)")
    @Enumerated(EnumType.STRING)
    private AddressType addressType;

    @Column(name = "is_default")
    private boolean defaultAddress ;

}
