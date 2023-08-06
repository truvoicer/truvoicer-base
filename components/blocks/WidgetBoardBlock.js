import React from 'react';
import UserSocialWidget from "../widgets/UserSocialWidget";
import UserProfileWidget from "@/truvoicer-base/components/widgets/user/profile/UserProfileWidget";
import UserStatsWidget from "../widgets/UserStatsWidget";
import UserTextReplacerWidget from "../widgets/UserTextReplacerWidget";
import FormsProgressWidget from "../widgets/FormsProgressWidget";
import TabsBlock from "@/truvoicer-base/components/blocks/Tabs/TabsBlock";

function WidgetBoardBlock({data}) {
    const contentWidgets = data?.content_widgets;
    const sidebarWidgets = data?.sidebar_widgets;

    const getWidget = (widgetData) => {
        switch (widgetData?.id) {
            case "user-social":
                return <UserSocialWidget data={widgetData} />
            case "user-profile":
                return <UserProfileWidget data={widgetData} />
            case 'tab-block':
                return <TabsBlock data={widgetData} />;
            case "user-stats":
                return <UserStatsWidget data={widgetData} />
            case "form-progress":
                return <FormsProgressWidget data={widgetData} />
            default:
               return null;
        }
    }
    console.log({data})
    return (
            <div className="container-fluid">
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
                            <UserTextReplacerWidget text={data?.heading} />
                        </h1>
                        {Array.isArray(contentWidgets) && contentWidgets.map((widget, index) => (
                            <React.Fragment key={index}>
                                {getWidget(widget)}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
    );
}

export default WidgetBoardBlock;
