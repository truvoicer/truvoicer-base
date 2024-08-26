import ItemViewWidget from "../components/blocks/ItemViewBlock";
import HeroBlock from "../components/blocks/HeroBlock";
import PostItemBlock from "../components/blocks/PostItemBlock";
import SearchBlock from "../components/blocks/SearchBlock";
import WidgetBoardBlock from "../components/blocks/WidgetBoardBlock";
import CustomItemsCarousel from "../components/blocks/carousel/CustomItemsCarousel";
import ListingsBlockInterface from "../components/blocks/listings/ListingsBlockInterface";

import LoginBlock from "../components/forms/Auth/LoginBlock";
import RegisterBlock from "../components/forms/Auth/RegisterBlock";
import AuthLoginWrapper from "../components/forms/Auth/LoginDialog";
import AuthRegisterWrapper from "../components/forms/Auth/RegisterDialog";
import UserAccountBlock from "../components/blocks/UserAccountBlock";
import PasswordResetBlock from "../components/blocks/PasswordResetBlock";
import PasswordResetDialog from "../components/forms/Auth/PasswordResetDialog";
import FormBlock from "../components/blocks/form/FormBlock";
import UserSavedItemsBlock from "../components/blocks/UserSavedItemsBlock";
import OptinBlock from "../components/blocks/optin/OptinBlock";
import TabsBlock from "@/truvoicer-base/components/blocks/Tabs/TabsBlock";
import CarouselInterface from "@/truvoicer-base/components/blocks/carousel/CarouselInterface";
import CustomHtmlWidget from "@/truvoicer-base/components/widgets/CustomHtmlWidget";
import ListingsFilterInterface from "@/truvoicer-base/components/blocks/listings/sidebars/ListingsFilterInterface";
import SocialWidgetInterface from "@/truvoicer-base/components/widgets/Social/SocialWidgetInterface";

export const blockComponentsConfig = {
    components: {
        hero_block: {
            name: "hero_block",
            component: HeroBlock
        },
        search_block: {
            name: "search_block",
            component: SearchBlock
        },
        listings_block: {
            name: "listings_block",
            component: ListingsBlockInterface
        },
        item_view_block: {
            name: "item_view_block",
            component: ItemViewWidget
        },
        login_block: {
            name: "login_block",
            component: LoginBlock
        },
        register_block: {
            name: "register_block",
            component: RegisterBlock
        },
        password_reset_block: {
            name: "password_reset_block",
            component: PasswordResetBlock
        },
        user_account_block: {
            name: "user_account_block",
            component: UserAccountBlock
        },
        authentication_login: {
            name: "authentication_login",
            component: AuthLoginWrapper
        },
        authentication_register: {
            name: "authentication_register",
            component: AuthRegisterWrapper
        },
        authentication_password_reset: {
            name: "authentication_password_reset",
            component: PasswordResetDialog
        },
        tabs_block: {
            name: "tabs_block",
            component: TabsBlock
        },
        carousel_block: {
            name: "carousel_block",
            component: CarouselInterface
        },
        form_block: {
            name: "form_block",
            component: FormBlock
        },
        user_saved_items_block: {
            name: "user_saved_items_block",
            component: UserSavedItemsBlock
        },
        opt_in_block: {
            name: "opt_in_block",
            component: OptinBlock
        },
        post_block: {
            name: "post_block",
            component: PostItemBlock
        },
        widget_board_block: {
            name: "widget_board_block",
            component: WidgetBoardBlock
        },
        html_block: {
            name: "html_block",
            component: CustomHtmlWidget
        },
        listings_filters_block: {
            name: "listings_filters_block",
            component: ListingsFilterInterface
        },
        saved_items_block: {
            name: "saved_items_block",
            component: UserSavedItemsBlock
        },
        social_block: {
            name: "social_block",
            component: SocialWidgetInterface
        },
    //     dashboard: {
    //         name: "dashboard",
    //         component: UserDashboard
    //     },
    //     saved_items: {
    //         name: "saved_items",
    //         component: UserSavedItems
    //     },
    //     user_profile: {
    //         name: "user_profile",
    //         component: UserProfile
    //     },
    //     messages: {
    //         name: "messages",
    //         component: UserMessages
    //     },
    //     account_details: {
    //         name: "account_details",
    //         component: UserAccountDetails
    //     },
    },
}
