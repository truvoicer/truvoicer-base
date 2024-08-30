import React, {useContext} from 'react';
import UserSocialWidget from "../widgets/UserSocialWidget";
import UserProfileWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileWidget";
import UserStatsWidget from "../widgets/UserStatsWidget";
import UserTextReplacerWidget from "../widgets/UserTextReplacerWidget";
import FormsProgressWidget from "../widgets/FormsProgressWidget";
import TabsBlock from "@/truvoicer-base/components/blocks/Tabs/TabsBlock";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";
import WpDataLoader from "@/truvoicer-base/components/loaders/WpDataLoader";
import {UserAccountHelpers} from "@/truvoicer-base/library/user-account/UserAccountHelpers";
import UserSavedItemsBlock from "@/truvoicer-base/components/blocks/UserSavedItemsBlock";
import {blockComponentsConfig} from "@/truvoicer-base/config/block-components-config";

function WidgetBoardBlock(props) {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const contentWidgets = data?.content_widgets;
    const sidebarWidgets = data?.sidebar_widgets;

    const getWidget = (widgetData) => {
        const widgetProps = {
            parentAccessControl: data?.access_control,
            data: widgetData
        }
        if (!widgetData?.id) {
            console.warn('Widget data is missing id', widgetData);
            return null;
        }
        const findComponentConfig = blockComponentsConfig.components[widgetData.id];
        if (findComponentConfig?.component) {
            const Component = findComponentConfig.component;
            return templateManager.render(<Component {...widgetProps} />);
        }
        return null;
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
                    <WpDataLoader>
                        {renderContentWidgets()}
                    </WpDataLoader>
                )
                : renderContentWidgets()
            }
        </>
    );
}

WidgetBoardBlock.category = 'public';
WidgetBoardBlock.templateId = 'widgetBoardBlock';

export default WidgetBoardBlock;
