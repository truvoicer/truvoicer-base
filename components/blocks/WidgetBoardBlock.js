import React, {useContext} from 'react';
import UserSocialWidget from "../widgets/UserSocialWidget";
import UserProfileWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileWidget";
import UserStatsWidget from "../widgets/UserStatsWidget";
import UserTextReplacerWidget from "../widgets/UserTextReplacerWidget";
import FormsProgressWidget from "../widgets/FormsProgressWidget";
import TabsBlock from "@/truvoicer-base/components/blocks/Tabs/TabsBlock";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

function WidgetBoardBlock(props) {
    const {data} = props;
    const templateManager = new TemplateManager(useContext(TemplateContext));
    const contentWidgets = data?.content_widgets;
    const sidebarWidgets = data?.sidebar_widgets;

    const getWidget = (widgetData) => {
        switch (widgetData?.id) {
            case "user-social":
                return templateManager.render(<UserSocialWidget data={widgetData} />);
            case "user-profile":
                return templateManager.render(<UserProfileWidget data={widgetData} />);
            case 'tab-block':
                return templateManager.render(<TabsBlock data={widgetData} />);
            case "user-stats":
                return templateManager.render(<UserStatsWidget data={widgetData} />);
            case "form-progress":
                return templateManager.render(<FormsProgressWidget data={widgetData} />);
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
    const hasSidebarWidgets = (Array.isArray(sidebarWidgets) && sidebarWidgets.length > 0);
    return (
        <div className={`${getBlockContainerClasses()}`}>
            {hasSidebarWidgets
            ? (
            <div className="row">
                <div className="col-12 col-md-12 col-lg-4 col-xl-3">
                    {Array.isArray(sidebarWidgets) && sidebarWidgets.map((widget, index) => (
                        <React.Fragment key={index}>
                            {getWidget(widget)}
                        </React.Fragment>
                    ))}
                </div>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9">
                    <h1>
                        <UserTextReplacerWidget text={data?.heading}/>
                    </h1>
                    {Array.isArray(contentWidgets) && contentWidgets.map((widget, index) => (
                        <React.Fragment key={index}>
                            {getWidget(widget)}
                        </React.Fragment>
                    ))}
                </div>
            </div>
                )
                : (
                    <div className="">
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

WidgetBoardBlock.category = 'public';
WidgetBoardBlock.templateId = 'widgetBoardBlock';

export default WidgetBoardBlock;
