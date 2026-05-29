package vn.web.Services;

import vn.web.Model.Voucher;

import java.util.List;

public interface VoucherService {
    Voucher createVoucher(Voucher voucher);
    List<Voucher> getAllVouchers();
    public void deleteVoucher(Long id);
}
