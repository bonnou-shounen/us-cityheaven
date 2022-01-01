// ==UserScript==
// @name        cityheaven-plus
// @version     0.0.4
// @match       https://www.cityheaven.net/*
// ==/UserScript==

(function() {
    'use strict';

    // オフィシャルフラグを削除する
    if (location.search.match(/\bof=y\b/)) {
        location.search = location.search.replace(/\bof=y\b/, '')
        return
    }

    // 便利リンクを作る
    const myh = document.getElementsByClassName('myh')[0]
    if (myh) {
      const ul = myh.parentNode.parentNode
      const li = document.createElement('li')
      ul.insertBefore(li, null)
      li.innerHTML = `
        <a href="/tt/community/ABFavoriteGirlList/?spmode=pc">マイガ</a>
        <a href="/tt/community/ABMyAlbumShukkin/?spmode=pc">出勤</a>
        <a href="/tt/community/SBMyAlbumShukkin/?pcmode=sp" target="_blank">週間</a>
        <a href="/mypage/comeonlist/?spmode=pc" target="_blank">キテネ</a>
      `
      return
    }

    const myg = document.getElementsByClassName('header-wrap-menu-item')[1]
    if (myg) {
        const menuDiv = myg.parentNode
        const div = document.createElement('div')
        div.className = 'header-wrap-menu-item'
        menuDiv.insertBefore(div, myg.nextSibling)
        div.innerHTML = `
          <a href="/tt/community/ABMyAlbumShukkin/?spmode=pc">出勤</a>
          ・<a href="/tt/community/SBMyAlbumShukkin/?pcmode=sp" target="_blank">週間</a>
          ・ <a href="/mypage/comeonlist/?spmode=pc" target="_blank">キテネ</a>
        `
        return
    }
})()
