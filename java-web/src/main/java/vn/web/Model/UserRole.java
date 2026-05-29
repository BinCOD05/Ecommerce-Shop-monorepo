//package vn.web.Model;
//
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.io.Serializable;
//
//@Entity
//@Table(name = "user_role")
//@Getter
//@Setter
//public class UserRole extends AbstractEntity implements Serializable {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id ;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private UserEntity user ;
//
//    @ManyToOne
//    @JoinColumn(name = "role_id")
//    private Role role ;
//
//}
