package vn.web.Services.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.web.Controller.Request.ProductCreationRequest;
import vn.web.Controller.Request.ProductFilterSearch;
import vn.web.Controller.Request.ProductUpdateRequest;
import vn.web.Controller.Response.PageResponse;
import vn.web.Controller.Response.ProductDetailResponse;
import vn.web.Controller.Response.ProductSummaryResponse;
import vn.web.Converter.ProductMapper;
import vn.web.Exception.ResourceNotFoundException;
import vn.web.Model.*;
import vn.web.Repository.BrandRepository;
import vn.web.Repository.CategoryRepository;
import vn.web.Repository.ProductRepository;
import vn.web.Services.ProductService;
import vn.web.Util.ProductSpec;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public ProductDetailResponse createProduct(ProductCreationRequest req, List<MultipartFile> files) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category không tồn tại: " + req.getCategoryId()));
        Brand brand = brandRepository.findById(req.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand không tồn tại: " + req.getBrandId()));

        Product product = productMapper.toEntity(req);
        product.setCategory(category);
        product.setBrand(brand);

        Inventory inventory = new Inventory();
        inventory.setQuantity(req.getStock());
        inventory.setProduct(product);
        product.setInventory(inventory);

        if (files != null && !files.isEmpty()) {
            if (req.getImages() != null && files.size() != req.getImages().size()) {
                throw new RuntimeException("Số file ảnh (" + files.size() + ") không khớp với metadata ảnh (" + req.getImages().size() + ")");
            }

            Set<ProductImage> imageSet = new HashSet<>();
            for (int i = 0; i < files.size(); i++) {
                String url = cloudinaryService.upload(files.get(i));
                ProductImage img = new ProductImage();
                img.setImageUrl(url);
                img.setProduct(product);

                if (req.getImages() != null) {
                    ProductCreationRequest.ProductImageReqDTO meta = req.getImages().get(i);
                    img.setPrimary(meta.getPrimary());
                    img.setSortOrder(meta.getSortOrder());
                } else {
                    img.setPrimary(i == 0);
                    img.setSortOrder(i);
                }
                imageSet.add(img);
            }
            product.setProductImages(imageSet);
        }

        return productMapper.toDTOResponse(productRepository.save(product));
    }

    @Override
    public ProductDetailResponse getProductDetail(long id) {
        Product product = productRepository.findByIdFullInfo(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + id));
        return productMapper.toDTOResponse(product);
    }

    @Override
    @Transactional
    public PageResponse<ProductSummaryResponse> getProductList(ProductFilterSearch req, Pageable pageable) {
        Specification<Product> spec = ProductSpec.search(req);
        Page<Product> page = productRepository.findAll(spec, pageable);

        List<ProductSummaryResponse> content = page.stream().map(p -> {
            ProductSummaryResponse dto = new ProductSummaryResponse();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setPrice(p.getPrice());
            dto.setColor(p.getColor());
            dto.setBrandName(p.getBrand().getName());
            dto.setBrandId(p.getBrand().getId());
            dto.setCategoryName(p.getCategory().getName());
            dto.setCategoryId(p.getCategory().getId());
            if (p.getInventory() != null) {
                dto.setStock(p.getInventory().getQuantity());
            }
            dto.setThumbnailUrl(p.getProductImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getPrimary()))
                    .findFirst()
                    .map(ProductImage::getImageUrl)
                    .orElse(null));
            return dto;
        }).collect(Collectors.toList());

        return PageResponse.<ProductSummaryResponse>builder()
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElement(page.getTotalElements())
                .totalPage(page.getTotalPages())
                .content(content)
                .build();
    }

    @Override
    @Transactional
    public ProductDetailResponse updateProduct(ProductUpdateRequest req, long id) {
        Product product = productRepository.findByIdFullInfo(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + id));
        productMapper.updateProduct(product, req);
        if (req.getStock() != null && product.getInventory() != null) {
            product.getInventory().setQuantity(req.getStock());
        }
        return productMapper.toDTOResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại: " + id));
        product.setActive(false);
        productRepository.save(product);
    }
}
