
/* JavaScript content from js/appcenter/nls/ja/common.js in folder common */
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
    catalogTitle: "カタログ",
    favoritesTitle: "お気に入り",
    updatesTitle: "更新",
    catalogTab: "カタログ",
    favoritesTab: "お気に入り",
    updatesTab: "更新",
    appcenterTitle: "App Center",
    versionHistoryTitle: "バージョン",
    detailsTitle: "詳細",
    reviewsTitle: "レビュー",
    rateTitle: "レビューの書き込み",
    rateTitleShort: "レビュー",
    logout:"ログアウト",
    loadingLabel: "ロード中…",
    pushNotificationRegistrationError: "プッシュ通知の登録が失敗しました。 登録 ID を確認し、後でもう一度やり直してください。",
    globalErrorMessage: "予期しないエラーが発生しました (${message})。 終了します",
    defaultDeviceNickname: "${username} の ${phoneModel}",

    // START NON-TRANSLATABLE
    detailsRating: "(${nb_rating})",
    errorWithMessage:"${message}<br/>${reason}",
    // END NON-TRANSLATABLE

    loginLabel: "ユーザー名",
    passwordLabel: "パスワード",
    serverNameLabel: "サーバー",
    serverPortLabel: "ポート",
    serverContextLabel: "コンテキスト",
    sslLabel: "SSL",

    tabletUsernamePH: "",
    tabletPasswordPH: "",
    tabletServerNamePH: "サーバー[:ポート][/コンテキスト]",

    phoneUsernamePH: "ユーザー名",
    phonePasswordPH: "パスワード",
    phoneServerNamePH: "ホスト名または IP",
    phoneServerPortPH: "サーバー・ポート",
    phoneServerContextPH: "アプリケーション・コンテキスト",

    credentials: "資格情報",
    loginButton: "ログイン",
    logoutButton: "ログアウト",
    refreshButton: "更新",
    detailsVersion: "バージョン: ${version}",
    detailsInternalVersion: "内部バージョン: ${version}",
    detailsLatestVersion: "最新バージョン: ${version}",
    detailsUpdatedOn: "更新日: ${date}",
    detailsAllVersions: "すべてのバージョン",
    fileSize: "サイズ: ${size}${unit}",
    fileSizeMbUnit: "M",
    fileSizeKbUnit: "k",
    sendButton: "レビューの送信",
    back: "戻る",
    install: "インストール",
    reInstall: "再インストール",
    revert: "元に戻す",
    uninstall: "アンインストール",
    cancelInstall: "インストールの取り消し",
    cancelUninstall: "アンインストールの取り消し",
    installing: "インストール中…",
    installationStarted: "インストールが開始されました…",
    update: "更新",
    gotoAppStore: "ストアに進む",
    noApplication: "利用可能なアプリケーションがありません",
    noUpdate: "利用可能な更新がありません",
    noFavorite: "お気に入りのアプリケーションがありません",
    noReview: "このバージョンのレビューはありません",
    noReviewAllVersions: "このアプリケーションのレビューはありません",
    applicationFavorite: "アプリケーションはお気に入りに登録されました",
    applicationNotFavorite: "アプリケーションはお気に入りから削除されました",
    reviewSentConfirmation: "レビューが送信されました",
    errorDialogTitle: "エラー",
    warningDialogTitle: "警告",
    okButton: "OK",
    yesButton: "はい",
    noButton: "いいえ",
    closeButton: "閉じる",
    retryButton: "再試行",
    cancelButton: "キャンセル",
    versionDlgTitle: "バージョンの選択",
    addReviewButton: "レビューの書き込み",
    rateInstalled: "バージョン ${version} のレビュー",
    rateInstalledDisabled: "インストール済みバージョンのレビュー…",
    reviewsVersion: "バージョン ${version}",
    viewReviews: "レビューの表示",
    versionHistory: "バージョンの選択",
    noDescription: "説明がありません…",
    popularTab: "人気",
    lastUpdateTab: "最終更新日時",
    nameTab: "名前",
    loadMore: "さらにロード…",
    versionListInstalled: "${version} (インストール済み)",
    updateListItemVersion: "${version} (${versionInstalled} はインストール済み)",
    ratingErrorTitle: "レーティング・エラー",
    loginErrorTitle: "接続エラー",
    mustInstallAppToRate: "アプリケーションのバージョンがインストールされていないため、アプリケーションを評価できません。最初にバージョンをインストールしてください。",
    reviewNotSentApplicationNotInCatalog: "アプリケーションがカタログ内にないため、レビューを送信できません。",
    missingCommentOrRating: "レビューを送信できません。レーティングおよびコメントを指定する必要があります。",
    missingInfo: "サーバーに接続できません。次の情報が入力されていません:",
    missingLogin: "ログイン",
    missingPassword: "パスワード",
    missingServerUrl: "Application Center サーバー URL",
    missingServer: "Application Center ホスト名または IP アドレス",
    invalidServerUrl: "Application Center URL が無効です",
    invalidLoginPw: "無効なユーザー名またはパスワード",
    unreachableServer: "サーバーに到達できません。 後でもう一度やり直すか、接続の詳細を確認してください。",
    genericError: "接続が失敗しました。 接続の詳細を確認してください。",
    genericErrorWithStatus: "接続が失敗しました。 接続の詳細 (HTTP 状況 ${status}) を確認してください。",
    genericErrorWithMessage: "接続が失敗しました。 接続の詳細 (${message}) を確認してください。",
    installErrorWP81Debug: "署名されていない Application Center クライアントを現在使用しているため、インストールが失敗しました。まず、クライアント XAP ファイルをコード署名して、クライアントを正常に実行させる必要があります (HRESULT ${hresult})。",
    installErrorWPCertificate: "XAP ファイルのコード署名に使用された PFX 証明書が期限切れであるため、インストールが失敗しました (HRESULT ${hresult})。",
    installErrorWP: "インストールが失敗しました (HRESULT ${hresult})。",
    timeoutError: "接続がタイムアウトになりました。 後でもう一度やり直してください。",
    serverError: "サーバー・エラー。 サーバー管理者にお問い合わせください。",
    errorDeletedApp: "アプリケーションがカタログから削除されたため、アプリケーションの詳細を表示できません。",
    goToCatalog: "カタログ・ビューを開く",
    appNotFound: "アプリケーションは現行環境のカタログ内に見つかりませんでした。",
    invalidUrl: "URL が無効です。",

    preferencesTitle: "設定",
    sortTitle: "ソート",

    showAllVersion: "すべてのバージョン",
    applicationName: "アプリケーション名",
    updateDialogTitle: "利用可能な更新があります",
    updateDialogMessage: "更新を表示しますか?",
    appcenterUpdateDialogTitle: "アプリケーション・センターに更新があります",
    appcenterUpdateDialogMessage: "新しいバージョンをインストールしますか?",
    appcenterUpdateFailedMessage: "最新バージョンのアプリケーション・センターのインストールが失敗しました",

    /*switch button label: 4 characters max */
    sslSwitchOn: "オン",

    /*switch button label: 4 characters max */
    sslSwitchOff: "オフ",

    // Tablet
    tabletAppcenterTitle: "Application Center",
    detailSegment: "詳細",
    reviewsSegment: "${version} のレビュー",
    allReviewsSegment: "すべてのレビュー",
    tabletNameTab: "名前順にソート",
    tabletPopularTab: "人気度順にソート",
    tabletRatingTab: "レーティング順にソート",
    tabletLastUpdateTab: "日付順にソート",

    /*sort criterion, must be less or equals 20 characters */
    sortName: "名前",
    /*sort criterion, must be less or equals 20 characters */
    sortPopularTab: "人気度",
    /*sort criterion, must be less or equals 20 characters */
    sortRatingTab: "レーティング",
    /*sort criterion, must be less or equals 20 characters */
    sortDateTab: "日付",

    toggleFavorite: "お気に入りの切り替え"

// end v1.x content
});

