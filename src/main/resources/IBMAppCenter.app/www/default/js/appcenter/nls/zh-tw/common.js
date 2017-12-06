
/* JavaScript content from js/appcenter/nls/zh-tw/common.js in folder common */
// NLS_CHARSET=UTF-8
// 
/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2014. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
define({
  // begin v1.x content
    // START NON-TRANSLATABLE
    // END NON-TRANSLATABLE
    catalogTitle: "型錄",
    favoritesTitle: "我的最愛",
    updatesTitle: "更新",
    catalogTab: "型錄",
    favoritesTab: "我的最愛",
    updatesTab: "更新",
    appcenterTitle: "App Center",
    versionHistoryTitle: "版本",
    detailsTitle: "詳細資料",
    reviewsTitle: "評論",
    rateTitle: "撰寫評論",
    rateTitleShort: "評論",
    logout:"登出",
    loadingLabel: "載入中...",
    pushNotificationRegistrationError: "推送通知登錄失敗。請檢查登錄 ID，並於稍後重再試",
    globalErrorMessage: "發生非預期的錯誤 (${message})。結束中",
    defaultDeviceNickname: "${username} 的 ${phoneModel}",

    // START NON-TRANSLATABLE
    detailsRating: "(${nb_rating})",
    errorWithMessage:"${message}<br/>${reason}",
    // END NON-TRANSLATABLE

    loginLabel: "使用者名稱",
    passwordLabel: "密碼",
    serverNameLabel: "伺服器",
    serverPortLabel: "埠",
    serverContextLabel: "環境定義",
    sslLabel: "SSL",

    tabletUsernamePH: "",
    tabletPasswordPH: "",
    tabletServerNamePH: "server[:port][/context]",

    phoneUsernamePH: "使用者名稱",
    phonePasswordPH: "密碼",
    phoneServerNamePH: "主機名稱或 IP",
    phoneServerPortPH: "伺服器埠",
    phoneServerContextPH: "應用程式環境定義",

    credentials: "認證",
    loginButton: "登入",
    logoutButton: "登出",
    refreshButton: "重新整理",
    detailsVersion: "版本：${version}",
    detailsInternalVersion: "內部版本：${version}",
    detailsLatestVersion: "最新版本：${version}",
    detailsUpdatedOn: "更新日期：${date}",
    detailsAllVersions: "所有版本",
    fileSize: "大小：${size}${unit}",
    fileSizeMbUnit: "M",
    fileSizeKbUnit: "k",
    sendButton: "提交評論",
    back: "上一步",
    install: "安裝",
    reInstall: "重新安裝",
    revert: "回復",
    uninstall: "解除安裝",
    cancelInstall: "取消安裝",
    cancelUninstall: "取消解除安裝",
    installing: "正在安裝…",
    installationStarted: "安裝已啟動…",
    update: "更新",
    gotoAppStore: "前往商店",
    noApplication: "沒有可用的應用程式",
    noUpdate: "沒有可用的更新",
    noFavorite: "沒有最愛的應用程式",
    noReview: "沒有此版本的評論",
    noReviewAllVersions: "沒有此應用程式的評論",
    applicationFavorite: "已將應用程式標示為我的最愛",
    applicationNotFavorite: "已取消應用程式之我的最愛標示",
    reviewSentConfirmation: "已傳送評論",
    errorDialogTitle: "錯誤",
    warningDialogTitle: "警告",
    okButton: "確定",
    yesButton: "是",
    noButton: "否",
    closeButton: "關閉",
    retryButton: "重試",
    cancelButton: "取消",
    versionDlgTitle: "選擇版本",
    addReviewButton: "撰寫評論",
    rateInstalled: "評論版本 ${version}",
    rateInstalledDisabled: "評論已安裝的版本...",
    reviewsVersion: "版本 ${version}",
    viewReviews: "檢視評論",
    versionHistory: "選取版本",
    noDescription: "沒有說明...",
    popularTab: "熱門",
    lastUpdateTab: "前次更新",
    nameTab: "名稱",
    loadMore: "載入更多...",
    versionListInstalled: "${version}（已安裝）",
    updateListItemVersion: "${version}（已安裝 ${versionInstalled}）",
    ratingErrorTitle: "評分錯誤",
    loginErrorTitle: "連線錯誤",
    mustInstallAppToRate: "您尚未安裝此應用程式版本，所以無法對此應用程式進行評分。請先安裝此版本。",
    reviewNotSentApplicationNotInCatalog: "因為型錄中沒有此應用程式，所以無法傳送評論。",
    missingCommentOrRating: "無法傳送您的評論。您必須指定評分與評論。",
    missingInfo: "無法連線至伺服器。缺少下列資訊：",
    missingLogin: "登入",
    missingPassword: "密碼",
    missingServerUrl: "Application Center 伺服器 URL",
    missingServer: "Application Center 主機名稱或 IP 位址",
    invalidServerUrl: "Application Center URL 無效",
    invalidLoginPw: "無效的使用者名稱或密碼",
    unreachableServer: "無法聯繫伺服器。請於稍後重試，或是檢查您的連線詳細資料。",
    genericError: "連線失敗。請檢查您的連線詳細資料。",
    genericErrorWithStatus: "連線失敗。請檢查您的連線詳細資料（HTTP 狀態 ${status}）。",
    genericErrorWithMessage: "連線失敗。請檢查您的連線詳細資料（${message}）。",
    installErrorWP81Debug: "安裝失敗，因為您目前是使用未簽章的 Application Center 用戶端。必須先對用戶端 XAP 檔案進行程式碼簽章，才能順利地執行用戶端 (HRESULT ${hresult})。",
    installErrorWPCertificate: "安裝失敗，因為用來對 XAP 檔案進行程式碼簽章的 PFX 憑證已過期 (HRESULT ${hresult})。",
    installErrorWP: "安裝失敗 (HRESULT ${hresult})。",
    timeoutError: "連線逾時。請稍後再試一次。",
    serverError: "伺服器錯誤。請聯絡伺服器管理者。",
    errorDeletedApp: "因為應用程式已從型錄中移除，所以無法顯示其詳細資料。",
    goToCatalog: "開啟型錄視圖",
    appNotFound: "在現行環境的型錄中找不到應用程式。",
    invalidUrl: "URL 無效。",

    preferencesTitle: "喜好設定",
    sortTitle: "排序",

    showAllVersion: "所有版本",
    applicationName: "應用程式名稱",
    updateDialogTitle: "有可用的更新",
    updateDialogMessage: "顯示更新？",
    appcenterUpdateDialogTitle: "有可用的 Application Center 更新",
    appcenterUpdateDialogMessage: "安裝新版本？",
    appcenterUpdateFailedMessage: "最新版本的 Application Center 安裝失敗",

    /*switch button label: 4 characters max */
    sslSwitchOn: "開",

    /*switch button label: 4 characters max */
    sslSwitchOff: "關",

    // Tablet
    tabletAppcenterTitle: "Application Center",
    detailSegment: "詳細資料",
    reviewsSegment: "評論 ${version}",
    allReviewsSegment: "所有評論",
    tabletNameTab: "依名稱排序",
    tabletPopularTab: "依熱門程度排序",
    tabletRatingTab: "依評分排序",
    tabletLastUpdateTab: "依日期排序",

    /*sort criterion, must be less or equals 20 characters */
    sortName: "名稱",
    /*sort criterion, must be less or equals 20 characters */
    sortPopularTab: "熱門程度",
    /*sort criterion, must be less or equals 20 characters */
    sortRatingTab: "評分",
    /*sort criterion, must be less or equals 20 characters */
    sortDateTab: "日期",

    toggleFavorite: "切換我的最愛"

// end v1.x content
});

