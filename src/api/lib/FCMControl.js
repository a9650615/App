import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import {Platform} from 'react-native'

export default class FCMControl {
  loaded = false
  constructor() {
    FCM.requestPermissions() // for iOS
    FCM.subscribeToTopic('/topics/asd')
    FCM.getInitialNotification().then(notif=>console.log(notif))
    this.events()
  }

  events() {
    FCM.on('FCMNotificationReceived', (data) => {
      console.log('點下去'+data)
    })
    FCM.getFCMToken().then(token => {
      this.loaded = true
      // store fcm token in your server
      //FCM.getInitialNotification().then(notif=>console.log(notif));
      this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
          // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        if(notif.local_notification){
          //this is a local notification
        }
        if(notif.opened_from_tray){
          //app is open/resumed because user clicked banner
        }
        console.log(notif)
        if(Platform.OS ==='ios'){
          //optional
          //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link. 
          //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
          //notif._notificationType is available for iOS platfrom
          switch(notif._notificationType){
            case NotificationType.Remote:
              alert('from remote')
              notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
              break;
              case NotificationType.NotificationResponse:
              notif.finish();
              break;
            case NotificationType.WillPresent:
              notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
              break;
          }
        }
      })
      this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
        console.log(token)
        // fcm token may not be available on first load, catch it here
      })
    })
  }
  
  setBadgeNumber(number: int) {
    FCM.setBadgeNumber(number)
  }
  
  send() {
    // FCM.unsubscribeFromTopic('/topics');
    FCM.presentLocalNotification({
      id: "UNIQ_ID_STRING",                               // (optional for instant notification)
      title: "您有新訊息",                     // as FCM payload
      body: "吃通知",                    // as FCM payload (required)
      sound: "default",                                   // as FCM payload
      priority: "high",                                   // as FCM payload
      click_action: "ACTION",                             // as FCM payload
      badge: 666,                                          // as FCM payload IOS only, set 0 to clear badges
      my_custom_data:'asdasdasdasdasdasd',             // extra data you want to throw
      lights: true,                                       // Android only, LED blinking (default false)
      show_in_foreground: true                                // notification when app is in foreground (local & remote)
    })
    //   FCM.scheduleLocalNotification({
    //       fire_date: new Date().getTime(),      //RN's converter is used, accept epoch time and whatever that converter supports
    //       id: "UNIQ_ID_STRING",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
    //       body: "時間測試",
    //       repeat_interval: "hour" //day, hour
    //   }) 

    // });
  }
}
