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
import PostsBlock from "../components/blocks/posts/PostsBlock";
import TabsBlock from "@/truvoicer-base/components/blocks/Tabs/TabsBlock";

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
            component: CustomItemsCarousel
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
        posts_block: {
            name: "posts_block",
            component: PostsBlock
        },
        post_item_block: {
            name: "post_item_block",
            component: PostItemBlock
        },
        widget_board_block: {
            name: "widget_board_block",
            component: WidgetBoardBlock
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
