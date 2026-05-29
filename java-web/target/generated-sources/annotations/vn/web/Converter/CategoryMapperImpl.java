package vn.web.Converter;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.web.Controller.Response.CategoryResponse;
import vn.web.Controller.Response.CategoryTreeResponse;
import vn.web.Model.Category;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-29T14:22:36+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.2 (Oracle Corporation)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryResponse toDTOResponse(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryResponse categoryResponse = new CategoryResponse();

        categoryResponse.setParentId( categoryParentId( category ) );
        categoryResponse.setId( category.getId() );
        categoryResponse.setName( category.getName() );

        return categoryResponse;
    }

    @Override
    public CategoryTreeResponse toTreeDTO(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryTreeResponse categoryTreeResponse = new CategoryTreeResponse();

        categoryTreeResponse.setId( category.getId() );
        categoryTreeResponse.setName( category.getName() );
        categoryTreeResponse.setChildren( categoryListToCategoryTreeResponseList( category.getChildren() ) );

        return categoryTreeResponse;
    }

    @Override
    public List<CategoryResponse> toTreeCategoryList(List<Category> categories) {
        if ( categories == null ) {
            return null;
        }

        List<CategoryResponse> list = new ArrayList<CategoryResponse>( categories.size() );
        for ( Category category : categories ) {
            list.add( toDTOResponse( category ) );
        }

        return list;
    }

    private Long categoryParentId(Category category) {
        if ( category == null ) {
            return null;
        }
        Category parent = category.getParent();
        if ( parent == null ) {
            return null;
        }
        Long id = parent.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected List<CategoryTreeResponse> categoryListToCategoryTreeResponseList(List<Category> list) {
        if ( list == null ) {
            return null;
        }

        List<CategoryTreeResponse> list1 = new ArrayList<CategoryTreeResponse>( list.size() );
        for ( Category category : list ) {
            list1.add( toTreeDTO( category ) );
        }

        return list1;
    }
}
