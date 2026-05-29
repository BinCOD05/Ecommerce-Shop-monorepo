package vn.web.Services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.web.Model.Voucher;
import vn.web.Repository.VoucherRepository;
import vn.web.Services.VoucherService;

import java.util.List;

@RequiredArgsConstructor
@Service
public class VoucherServiceImpl implements VoucherService {


    private final VoucherRepository voucherRepository;

    @Override
    public Voucher createVoucher(Voucher voucher) {
        if (voucherRepository.findByCode(voucher.getCode()).isPresent()) {
            throw new RuntimeException("Mã Voucher này đã tồn tại!");
        }
        return voucherRepository.save(voucher);
    }

    @Override
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    // VoucherServiceImpl.java
    @Override
    public void deleteVoucher(Long id) {
        if (voucherRepository.existsById(id)) {
            voucherRepository.deleteById(id);
        } else {
            throw new RuntimeException("Voucher không tồn tại");
        }
    }
}
