<div class="login-wrapper accept_page" ng-controller="AuthCtrl">
    <!--div class="back-link">
        <a href="/" class="btn btn-add">Back to Dashboard</a>
    </div-->

    <div class="signin-header">
        <section class="logo text-center">
            <div class="wrap-logo">
                <a href="/">
                    <img src="/img/logo.png" alt="CRM" />
                </a>
            </div>
        </section>
    </div>

    <div class="container-center">
        <div class="login-area">
            <div class="panel panel-bd panel-custom">
                <div class="panel-heading">
                    <div class="view-header">
                        <div class="header-icon">
                            <i class="pe-7s-magic-wand"></i>
                        </div>

                        <div class="header-title">
                            <h3>Activate your account</h3>
                        </div>
                    </div>
                </div>

                <div class="panel-body">
                    <form id="loginForm" name="form" method="post" novalidate="novalidate">
                        <fieldset>
                            <div class="form-group">
                                <label for="users_name">Enter your username</label>
                                <div class="input-group input-group-first">
                                    <span class="input-group-addon">
                                        <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                                    </span>
                                    <input  type="text"
                                            class="form-control input-lg"
                                            placeholder="{{ __('Username') }}"
                                            ng-model="users_name"
                                            required="required"
                                            name="users_name"
                                       />
                                </div>
                            </div>

                            <div class="form-group">
                                <h4 class="text-center">Terms and Conditions</h4>
                                <div class="panel-body ui-map ui-map-scroll" data-slim-scroll data-scroll-height="240px">
                                    <p class="ft-greay">{{ __('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime, tenetur, repellat obcaecati unde esse doloribus accusamus exercitationem vitae corporis blanditiis aspernatur quibusdam porro rerum voluptatum quos eligendi necessitatibus enim! Maiores, doloribus, fuga, perspiciatis cupiditate aperiam repellendus natus nisi recusandae rerum optio consectetur nemo reprehenderit nesciunt molestiae at. Molestiae, nesciunt inventore dignissimos itaque exercitationem vero aliquam provident aperiam repudiandae nostrum. Ipsa, possimus, natus culpa magni rem iusto ut quisquam cupiditate aspernatur nemo sed aliquam quam illum illo quos dolor animi ipsum dolorem sunt beatae officia facere voluptatem omnis! Sapiente, illo voluptatibus amet omnis optio labore nesciunt porro facere praesentium laudantium molestiae voluptas eos incidunt quod nulla. Provident, debitis, odit qui ab facere adipisci laborum ea necessitatibus sapiente voluptatibus minima inventore veritatis unde nemo ipsa quisquam dolorum autem et minus repudiandae nostrum aliquam numquam aperiam similique vero delectus maiores non aliquid laboriosam eius impedit cum vel a corporis consequuntur natus earum suscipit. Repellat, laborum, cupiditate aperiam distinctio vero dolor est quibusdam sit rerum expedita tempore reiciendis quidem quisquam deserunt autem pariatur eos fugiat qui hic temporibus ullam dicta voluptatem sequi at iusto! Accusamus, iure, optio temporibus molestiae ab dolor blanditiis veritatis corporis eius reiciendis sed molestias obcaecati dolorem similique rerum illo excepturi.') }}</p>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="ui-checkbox">
                                    <input  ng-model="terms_and_conditions"
                                            name="checkbox1"
                                            type="checkbox"
                                            required="required"
                                            value=""
                                        />
                                    <span class="ft-greay">{{ __('I have read and agree to the terms and conditions koritsuvannya of service CRM.com') }}</span>
                                </label>
                            </div>
                            <div class="form-group">
                                <button
                                   type="submit"
                                   class="btn btn-add btn-lg btn-block text-center"
                                   ng-click="accept()">{{ __('Accept') }}</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>