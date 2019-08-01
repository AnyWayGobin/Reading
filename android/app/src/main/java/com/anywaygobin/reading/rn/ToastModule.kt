package com.anywaygobin.linkall.rn

import android.widget.Toast
import com.facebook.react.bridge.*


/**
 *   Created by wangyb on 2019/6/25 15:40
 */
class ToastModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private val EVENT_NAME = "EventName"
    }

    private val E_FUNCTION_ERROR = "E_FUNCTION_ERROR"

    override
    fun getName(): String {// 设置模块名称，需要与RN中调用时的模块名称保持一致
        return "ToastForAndroid"
    }

    /**
     * 让js那边能够使用这些常量 js直接使用这样的方式调用：NativeModules.ToastForAndroid.EventName
     */
    override fun getConstants(): MutableMap<String, Any> {
        val constants = mutableMapOf<String, Any>()
        constants[EVENT_NAME] = EVENT_NAME
        return constants
    }

    @ReactMethod
    fun show(duration: Int) {
        Toast.makeText(reactApplicationContext, "toast 测试", duration).show()
    }

    @ReactMethod
    fun byCallBackToRn(message: String, callback: Callback) {
        Toast.makeText(reactApplicationContext, "toast 测试 Callback", Toast.LENGTH_LONG).show()
        callback.invoke("toast 测试 Callback $message")
    }

    @ReactMethod
    fun byPromiseToRn(message: String, promise: Promise) {
        try {
            val result = "$message，收到回调信息"
            val map = Arguments.createMap()
            map.putString("content1", result)
            map.putString("content2", "toast 测试 Promise")

            // 回调成功，返回结果信息
            promise.resolve(map)
        } catch (e: Exception) {
            // 回调失败，返回错误信息
            promise.reject(E_FUNCTION_ERROR, e)
        }
    }

    @ReactMethod
    fun getDataFromIntent(callback: Callback) {
        currentActivity?.let {
            val result = it.intent.getStringExtra("data")
            if (!result.isNullOrEmpty()) {
                callback.invoke(result)
            } else {
                callback.invoke("no data")
            }
        }
    }

    /******************************以上都是rn调原生的方式**************************************/
}