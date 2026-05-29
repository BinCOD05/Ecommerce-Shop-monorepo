package vn.web.Model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import vn.web.Common.RoleType;

import java.io.Serializable;
import java.util.Set;


@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role extends AbstractEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id ;

    @Column(name = "name", columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    private RoleType name ;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(name = "user_roles" , joinColumns = @JoinColumn(name = "role_id") , inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<UserEntity> userSet ;
}
