package org.masterylearning.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.BasicAuth;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.service.SecurityScheme;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.ServletContext;
import java.util.Collections;
import java.util.List;

/**
 */
@Configuration
@EnableSwagger2
public class SwaggerConfiguration {
    @Bean
    public Docket api(ApiInfo apiInfo, ServletContext servletContext)
    {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build()
                .apiInfo (apiInfo)
                .securitySchemes (securitySchemes ())
                .securityContexts (securityContexts ());
    }

    @Bean
    public ApiInfo apiInfo () {
        return new ApiInfoBuilder ().title ("Interactive Lecture Notes API")
                                    .description ("Manage courses and users")
                                    .version ("0.7")
                                    .build ();
    }

    @Bean
    public List<SecurityReference> defaultAuth() {
        AuthorizationScope authorizationScope
                = new AuthorizationScope("global", "Global Scope");
        AuthorizationScope[] authorizationScopes = new AuthorizationScope[1];
        authorizationScopes[0] = authorizationScope;
        return Collections.singletonList (
                new SecurityReference("basic", authorizationScopes));
    }

    public List<SecurityContext> securityContexts ()
    {
        SecurityContext securityContext;

        securityContext = SecurityContext.builder ()
                                         .securityReferences (defaultAuth ())
                                         .forPaths(PathSelectors.regex("/.*"))
                                         .build ();

        return Collections.singletonList (securityContext);
    }

    List<SecurityScheme> securitySchemes ()
    {
        return Collections.singletonList(new BasicAuth ("basic"));
    }

}
