package vn.web.Services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.web.Controller.Request.AddressRequest;
import vn.web.Controller.Request.AddressUpdateRequest;
import vn.web.Controller.Response.AddressResponse;
import vn.web.Converter.AddressMapper;
import vn.web.Model.AddressEntity;
import vn.web.Model.UserEntity;
import vn.web.Repository.AddressRepository;
import vn.web.Repository.UserRepository;
import vn.web.Services.AddressService;
import vn.web.Util.SecurityUtils;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository ;

    private final AddressMapper addressMapper ;

    private final UserRepository userRepository ;

    @Override
    @Transactional
    public AddressResponse addNewAddress(AddressRequest req) {
        long userId = SecurityUtils.getCurrentId() ;
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        AddressEntity address = addressMapper.toEntity(req);
        address.setUser(user);

        if(addressRepository.countByUserId(userId) == 0){
            address.setDefaultAddress(true);
        }

        else if(req.isDefaultAddress()){
            Optional<AddressEntity> oldAddressEntityOpt = addressRepository.findByUserIdAndDefaultAddressTrue(userId);

            if(oldAddressEntityOpt.isPresent()){
                AddressEntity oldAddressDefault = oldAddressEntityOpt.get();
                oldAddressDefault.setDefaultAddress(false);
                addressRepository.save(oldAddressDefault);
            }

            address.setDefaultAddress(true);
        }

        else {
            address.setDefaultAddress(false);
        }

        addressRepository.save(address);

        return addressMapper.toDTOResponse(address);
    }

    @Override
    public List<AddressResponse> getListAddress() {
        long userId = SecurityUtils.getCurrentId();
        List<AddressResponse> results = addressRepository.findByUserId(userId).stream()
                .map(addressEntity -> addressMapper.toDTOResponse(addressEntity))
                .toList();


        return results;
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(long userId, long addressId) {

        AddressEntity address = addressRepository.findByIdAndUserId(addressId , userId).orElse(null);

        if(address == null ){
            throw  new RuntimeException("Không tìm thấy địa chỉ này");
        }

        addressRepository.removeAllDefault(userId);

        address.setDefaultAddress(true);
        addressRepository.save(address);
        return addressMapper.toDTOResponse(address);
    }



    @Override
    @Transactional
    public AddressResponse updateAddress(long userId, long addressId , AddressUpdateRequest req) {

       AddressEntity address = addressRepository.findByIdAndUserId(addressId , userId).orElse(null);

       if(address == null){
           throw new RuntimeException("User or Address not found");
       }

       addressMapper.updateAddress(address , req);

        return addressMapper.toDTOResponse(addressRepository.save(address));

    }

    @Override
    public void deleteAddress(long userId, long addressId) {
        AddressEntity address = addressRepository.findByIdAndUserId(addressId , userId).orElse(null);
        if (address == null) {
            throw  new RuntimeException("user not found");
        }
        addressRepository.delete(address);
    }
}
