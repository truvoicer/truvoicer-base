import React, {useContext} from 'react';
import UserSocialWidget from "../widgets/UserSocialWidget";
import UserProfileWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileWidget";
import UserStatsWidget from "../widgets/UserStatsWidget";
import UserTextReplacerWidget from "../widgets/UserTextReplacerWidget";
import FormsProgressWidget from "../widgets/FormsProgressWidget";
import TabsBlock from "@/truvoicer-base/components/blocks/Tabs/TabsBlock";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import UserAccountLoader from "@/truvoicer-base/components/loaders/UserAccountLoader";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";

function WidgetBoardBlock(props) {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const contentWidgets = data?.content_widgets;
    const sidebarWidgets = data?.sidebar_widgets;

    const getWidget = (widgetData) => {
        switch (widgetData?.id) {
            case 'user_stats_widget_block':
                return templateManager.render(<UserStatsWidget data={widgetData}/>);
            case 'user_social_widget_block':
                return templateManager.render(<UserSocialWidget data={widgetData}/>);
            case 'user_profile_widget_block':
                return templateManager.render(<UserProfileWidget data={widgetData}/>);
            case 'form_progress_widget_block':
                return templateManager.render(<FormsProgressWidget data={widgetData}/>);
            case 'tabs_block':
                return templateManager.render(<TabsBlock data={widgetData}/>);
            default:
                return null;
        }
    }

    function getBlockContainerClasses() {
        switch (data?.block_style) {
            case 'full-width':
                return 'container-fluid';
            default:
                return 'container';
        }
    }

    function getWidgetWidthClasses(widget) {
        return `col-${widget?.block_width || 12}`;
    }
    function renderContentWidgets() {
        return (
            <div className={`${getBlockContainerClasses()}`}>
                {hasSidebarWidgets
                    ? (
                        <div className="row mt-5">
                            <div className="col-12 col-md-12 col-lg-4 col-xl-3">
                                <div className={'row gap-5'}>
                                    {Array.isArray(sidebarWidgets) && sidebarWidgets.map((widget, index) => (
                                        <div key={index} className={`${getWidgetWidthClasses(widget)}`}>
                                            {getWidget(widget)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-12 col-md-12 col-lg-8 col-xl-9">
                                <h1>
                                    {/*<UserTextReplacerWidget text={data?.heading}/>*/}
                                </h1>
                                <div className={'row gap-5'}>
                                    {Array.isArray(contentWidgets) && contentWidgets.map((widget, index) => {
                                        return (
                                            <div key={index} className={`${getWidgetWidthClasses(widget)}`}>
                                                {getWidget(widget)}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        <div className="mt-5">
                            <h1>
                                <UserTextReplacerWidget text={data?.heading}/>
                            </h1>
                            {Array.isArray(contentWidgets) && contentWidgets.map((widget, index) => (
                                <React.Fragment key={index}>
                                    {getWidget(widget)}
                                </React.Fragment>
                            ))}
                        </div>
                    )
                }
            </div>
        );
    }
    const hasSidebarWidgets = (Array.isArray(sidebarWidgets) && sidebarWidgets.length > 0);

    return (
        <>
            {data?.access_control === 'protected'
                ? (
                    <UserAccountLoader
                        fields={UserAccountHelpers.getFields()}
                    >
                        {renderContentWidgets()}
                    </UserAccountLoader>
                )
                : renderContentWidgets()
            }
        </>
    );
}

WidgetBoardBlock.category = 'public';
WidgetBoardBlock.templateId = 'widgetBoardBlock';

export default WidgetBoardBlock;
