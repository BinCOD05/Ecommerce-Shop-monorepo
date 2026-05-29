package vn.web.Converter;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.web.Controller.Request.ProductCreationRequest;
import vn.web.Controller.Request.ProductUpdateRequest;
import vn.web.Controller.Response.BrandResponse;
import vn.web.Controller.Response.CategoryResponse;
import vn.web.Controller.Response.ProductDetailResponse;
import vn.web.Model.Brand;
import vn.web.Model.Category;
import vn.web.Model.Inventory;
import vn.web.Model.Product;
import vn.web.Model.ProductImage;
import vn.web.Model.ProductSpecs;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-29T14:22:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public Product toEntity(ProductCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        Product product = new Product();

        product.setBrand( productCreationRequestToBrand( request ) );
        product.setCategory( productCreationRequestToCategory( request ) );
        product.setProductSpecs( productSpecReqDTOListToProductSpecsSet( request.getSpecs() ) );
        product.setName( request.getName() );
        product.setPrice( request.getPrice() );
        product.setColor( request.getColor() );
        product.setStorage( request.getStorage() );
        product.setDescription( request.getDescription() );

        return product;
    }

    @Override
    public ProductDetailResponse toDTOResponse(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductDetailResponse.ProductDetailResponseBuilder productDetailResponse = ProductDetailResponse.builder();

        productDetailResponse.stock( productInventoryQuantity( product ) );
        productDetailResponse.images( productImageSetToProductImageSet( product.getProductImages() ) );
        productDetailResponse.specs( productSpecsSetToProductSpecSet( product.getProductSpecs() ) );
        productDetailResponse.id( product.getId() );
        productDetailResponse.name( product.getName() );
        productDetailResponse.description( product.getDescription() );
        productDetailResponse.color( product.getColor() );
        productDetailResponse.storage( product.getStorage() );
        productDetailResponse.price( product.getPrice() );
        productDetailResponse.category( categoryToCategoryResponse( product.getCategory() ) );
        productDetailResponse.brand( brandToBrandResponse( product.getBrand() ) );

        return productDetailResponse.build();
    }

    @Override
    public void updateProduct(Product product, ProductUpdateRequest updateRequest) {
        if ( updateRequest == null ) {
            return;
        }

        if ( updateRequest.getName() != null ) {
            product.setName( updateRequest.getName() );
        }
        if ( updateRequest.getPrice() != null ) {
            product.setPrice( updateRequest.getPrice() );
        }
        if ( updateRequest.getColor() != null ) {
            product.setColor( updateRequest.getColor() );
        }
        if ( updateRequest.getStorage() != null ) {
            product.setStorage( updateRequest.getStorage() );
        }
        if ( updateRequest.getDescription() != null ) {
            product.setDescription( updateRequest.getDescription() );
        }
    }

    protected Brand productCreationRequestToBrand(ProductCreationRequest productCreationRequest) {
        if ( productCreationRequest == null ) {
            return null;
        }

        Brand brand = new Brand();

        brand.setId( productCreationRequest.getBrandId() );

        return brand;
    }

    protected Category productCreationRequestToCategory(ProductCreationRequest productCreationRequest) {
        if ( productCreationRequest == null ) {
            return null;
        }

        Category category = new Category();

        category.setId( productCreationRequest.getCategoryId() );

        return category;
    }

    protected ProductSpecs productSpecReqDTOToProductSpecs(ProductCreationRequest.ProductSpecReqDTO productSpecReqDTO) {
        if ( productSpecReqDTO == null ) {
            return null;
        }

        ProductSpecs productSpecs = new ProductSpecs();

        productSpecs.setName( productSpecReqDTO.getName() );
        productSpecs.setValue( productSpecReqDTO.getValue() );

        return productSpecs;
    }

    protected Set<ProductSpecs> productSpecReqDTOListToProductSpecsSet(List<ProductCreationRequest.ProductSpecReqDTO> list) {
        if ( list == null ) {
            return null;
        }

        Set<ProductSpecs> set = new LinkedHashSet<ProductSpecs>( Math.max( (int) ( list.size() / .75f ) + 1, 16 ) );
        for ( ProductCreationRequest.ProductSpecReqDTO productSpecReqDTO : list ) {
            set.add( productSpecReqDTOToProductSpecs( productSpecReqDTO ) );
        }

        return set;
    }

    private Long productInventoryQuantity(Product product) {
        if ( product == null ) {
            return null;
        }
        Inventory inventory = product.getInventory();
        if ( inventory == null ) {
            return null;
        }
        Long quantity = inventory.getQuantity();
        if ( quantity == null ) {
            return null;
        }
        return quantity;
    }

    protected ProductDetailResponse.ProductImage productImageToProductImage(ProductImage productImage) {
        if ( productImage == null ) {
            return null;
        }

        ProductDetailResponse.ProductImage productImage1 = new ProductDetailResponse.ProductImage();

        productImage1.setId( productImage.getId() );
        productImage1.setImageUrl( productImage.getImageUrl() );
        productImage1.setPrimary( productImage.getPrimary() );
        if ( productImage.getSortOrder() != null ) {
            productImage1.setSortOrder( productImage.getSortOrder().longValue() );
        }

        return productImage1;
    }

    protected Set<ProductDetailResponse.ProductImage> productImageSetToProductImageSet(Set<ProductImage> set) {
        if ( set == null ) {
            return null;
        }

        Set<ProductDetailResponse.ProductImage> set1 = new LinkedHashSet<ProductDetailResponse.ProductImage>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( ProductImage productImage : set ) {
            set1.add( productImageToProductImage( productImage ) );
        }

        return set1;
    }

    protected ProductDetailResponse.ProductSpec productSpecsToProductSpec(ProductSpecs productSpecs) {
        if ( productSpecs == null ) {
            return null;
        }

        ProductDetailResponse.ProductSpec productSpec = new ProductDetailResponse.ProductSpec();

        productSpec.setId( productSpecs.getId() );
        productSpec.setName( productSpecs.getName() );
        productSpec.setValue( productSpecs.getValue() );

        return productSpec;
    }

    protected Set<ProductDetailResponse.ProductSpec> productSpecsSetToProductSpecSet(Set<ProductSpecs> set) {
        if ( set == null ) {
            return null;
        }

        Set<ProductDetailResponse.ProductSpec> set1 = new LinkedHashSet<ProductDetailResponse.ProductSpec>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( ProductSpecs productSpecs : set ) {
            set1.add( productSpecsToProductSpec( productSpecs ) );
        }

        return set1;
    }

    protected CategoryResponse categoryToCategoryResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse categoryResponse = new CategoryResponse();

        categoryResponse.setId( category.getId() );
        categoryResponse.setName( category.getName() );

        return categoryResponse;
    }

    protected BrandResponse brandToBrandResponse(Brand brand) {
        if ( brand == null ) {
            return null;
        }

        BrandResponse brandResponse = new BrandResponse();

        brandResponse.setId( brand.getId() );
        brandResponse.setName( brand.getName() );

        return brandResponse;
    }
}
