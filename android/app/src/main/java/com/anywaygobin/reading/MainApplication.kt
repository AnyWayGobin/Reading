package com.anywaygobin.reading

import android.app.Application
import com.anywaygobin.reading.rn.AndroidReactPackage
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader
import com.reactnativecommunity.webview.RNCWebViewPackage
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage


/**
 *  Created by wangyuebin on 2019/3/29 7:48 PM
 */
class MainApplication : Application(),ReactApplication {

    private lateinit var mainApplication: MainApplication

    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            return listOf(MainReactPackage(), AndroidReactPackage(), RNGestureHandlerPackage(), RNCWebViewPackage())
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    override fun onCreate() {
        super.onCreate()
        mainApplication = this
        SoLoader.init(this, /* native exopackage */ false)
    }
}