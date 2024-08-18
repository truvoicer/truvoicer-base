import React, {useContext} from 'react';
import {
    AppNotificationContext,
    NOTIFICATION_DEFAULT_POSITION,
    NOTIFICATION_DEFAULT_TYPE, NOTIFICATION_POSITION_BOTTOM,
    NOTIFICATION_POSITION_BOTTOM_CENTER,
    NOTIFICATION_POSITION_BOTTOM_LEFT,
    NOTIFICATION_POSITION_BOTTOM_RIGHT, NOTIFICATION_POSITION_TOP,
    NOTIFICATION_POSITION_TOP_CENTER,
    NOTIFICATION_POSITION_TOP_LEFT,
    NOTIFICATION_POSITION_TOP_RIGHT,
    NOTIFICATION_TYPE_CONTENT,
    NOTIFICATION_TYPE_TOAST, notificationPositions,
    notificationVariants
} from "@/truvoicer-base/config/contexts/AppNotificationContext";
import {Alert, Button} from "react-bootstrap";
import {isNotEmpty} from "@/truvoicer-base/library/utils";

function NotificationLoader({
    fixed = true,
    position = NOTIFICATION_DEFAULT_POSITION,
    type = NOTIFICATION_DEFAULT_TYPE
}) {
    const appNotificationContext = useContext(AppNotificationContext);

    function showNotification(notification) {
        if (!notification?.show) {
            return false;
        }
        if (notification?.type !== type) {
            return false;
        }

        switch (type) {
            case NOTIFICATION_TYPE_CONTENT:
                if (notification?.position !== position) {
                    return false;
                }
        }
        return true;
    }

    function getPositionClasses(position) {
        let classes = [];
        switch (position) {
            case NOTIFICATION_POSITION_TOP:
            case NOTIFICATION_POSITION_TOP_CENTER:
                classes.push('toasts-top-center');
                break;
            case NOTIFICATION_POSITION_TOP_RIGHT:
                classes.push('toasts-top-right');
                break;
            case NOTIFICATION_POSITION_TOP_LEFT:
                classes.push('toasts-top-left');
                break;
            case NOTIFICATION_POSITION_BOTTOM:
            case NOTIFICATION_POSITION_BOTTOM_CENTER:
                classes.push('toasts-bottom-center');
                break;
            case NOTIFICATION_POSITION_BOTTOM_RIGHT:
                classes.push('toasts-bottom-left');
                break;
            case NOTIFICATION_POSITION_BOTTOM_LEFT:
                classes.push('toasts-bottom-left');
                break;
            default:
                console.warn('Unknown notification position', position);
                return null;
        }
        return classes.join(' ');
    }

    function getWrapper(position, notificationCount, notificationChildren) {
        switch (type) {
            case NOTIFICATION_TYPE_CONTENT:
                return (
                    <div className={'row'}>
                        <div className={'col-12'}>
                            {notificationChildren}
                        </div>
                    </div>
                );
            case NOTIFICATION_TYPE_TOAST:
                return (
                    <div
                        className={`toast ${fixed ? 'fixed' : ''} ${notificationCount ? 'show' : ''} ${getPositionClasses(position)}`}>
                        {notificationChildren}
                    </div>
                );
            default:
                console.warn('Unknown notification type', type);
                return null;
        }
    }

    function buildNotifications() {
        return appNotificationContext.notifications.filter(notification => showNotification(notification));
    }

    function renderNotificationAlerts(notificationData) {
        return (
            <>
                {notificationData.map((notification, index) => {
                    let variant = 'info';
                    if (isNotEmpty(notification?.variant) && notificationVariants.includes(notification.variant)) {
                        variant = notification.variant;
                    }
                    return (
                        <Alert
                            key={index}
                            show={true}
                            variant={variant}
                            dismissible={true}
                            onClose={() => appNotificationContext.remove(notification?.id)}>
                            {notification.hasOwnProperty('title') && (
                                <Alert.Heading>{notification.title}</Alert.Heading>
                            )}
                            {notification.hasOwnProperty('body') && (
                                <p>
                                    {notification.body}
                                </p>
                            )}
                            {notification.showFooter && (
                                <>
                                    <hr/>
                                    <div className="d-flex justify-content-end">
                                        <Button onClick={() => appNotificationContext.remove(notification?.id)}
                                                variant="outline-success">
                                            Close me
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Alert>
                    );
                })}
            </>
        );
    }

    function getNotificationPositionGroups() {
        return notificationPositions.map((position) => {
            return {
                position,
                notifications: notifications.filter((notification, index) => {
                    return notification.position === position;
                })
            };
        });
    }

    const notifications = buildNotifications();
    switch (type) {
        case NOTIFICATION_TYPE_CONTENT:
            return getWrapper(notifications.length, renderNotificationAlerts(notifications));
        case NOTIFICATION_TYPE_TOAST:
            return (
                <>
                    {getNotificationPositionGroups().map((group, index) => {
                        return (
                            <React.Fragment key={index}>
                                {getWrapper(
                                    group.position,
                                    group.notifications.length,
                                    renderNotificationAlerts(group.notifications)
                                )}
                            </React.Fragment>
                        );
                    })}
                </>
            );
        default:
            console.warn('Unknown notification type', type);
            return null;
    }
}

export default NotificationLoader;
