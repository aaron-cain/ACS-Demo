### 在ACR plugin 中添加一个新的指令,步骤如下:

## 添加一个获取指示灯状态的指令

1 在ACRNFCReaderPhoneGapPlugin.java文件中添加如下代码:

```java
    private static final String GET_LED_STATUS = "getLedStatus";

    ...

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {
      ...
       else if (action.equalsIgnoreCase(GET_LED_STATUS)) {
            getLedStatus(callbackContext);
        }
      ...
    }

    ...

    private void getLedStatus(final CallbackContext callbackContext) {
      BaseParams ledStatusParams = new BaseParams(0);
      ledStatusParams.setOnGetResultListener(generateResultListener(callbackContext));
      nfcReader.getLedStatus(ledStatusParams);
    }

    ...

```


2  在NFCReader.java 中添加如下代码:

```java

  public void getLedStatus(BaseParams ledStatusParams) {
       ledStatusParams.setReader(this);
       new GetLedStatusTask().execute(ledStatusParams);
   }

```

3  在com.frankgreen.task下创建GetLedStatusTask.java文件
   除了需要导入的类外,别忘记导入GetLedStatus这个类

```java
package com.frankgreen.task;

import android.os.AsyncTask;
import com.frankgreen.apdu.command.GetLedStatus;
import com.frankgreen.params.BaseParams;
/**
 * Created by Kevin on 16/3/1.
 */
public class GetLedStatusTask extends AsyncTask<BaseParams, Void, Boolean> {

    final private String TAG = "GetLedStatusTask";

    @Override
    protected Boolean doInBackground(BaseParams... paramses) {
        BaseParams params = paramses[0];
        if(params == null) {
            return false;
        }
        if(!params.getReader().isReady()) {
            params.getReader().raiseNotReady(params.getOnGetResultListener());
        }
        GetLedStatus ledStatus = new GetLedStatus(params);
        return ledStatus.run();
    }
}

```

4　在com.frankgreen.apdu.command下创建GetLedStatus.java文件, 省略的部分参照其它类的写法

```java

...
public class GetLedStatus extends Base<BaseParams> {

    private static final String TAG = "GetLedStatus";

    ...


    public String toDataString(Result result) {
        byte[] data = new byte[1];
        System.arraycopy(result.getData().clone(), 5, data, 0, 1);
        return Util.toHexString(data);
    }

    public boolean run() {
        byte[] sendBuffer = new byte[]{(byte) 0xE0, (byte) 0x00, (byte) 0x00, (byte) 0x29, (byte) 0x00};

        ...
    }
}

```

5 在www/ACR-NFC-Reader-PhoneGap-Plugin.js中添加如下代码:

```js
ACR.getLedStatus = function(success, failure) {
  cordova.exec(success, failure, "ACRNFCReaderPhoneGapPlugin", "getLedStatus", []);
}
```


## 在Demo中调用plugin中的方法

１ 首先在www/index.html中增加一个button

```html
  <button disable="disable" id="get_led_status">Get LED Status</button>
```

2  在www/js/index.js中给button增加点击事件

```js

  var getLedStatus = document.getElementById("get_led_status");

  getLedStatus.addEventListener('click', function() {
    ACR.getLedStatus(_cb, _cb);
  });

```
