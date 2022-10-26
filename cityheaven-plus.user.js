// ==UserScript==
// @name        cityheaven-plus
// @description add convinient elements
// @version     0.0.11
// @match       https://www.cityheaven.net/*
// ==/UserScript==

(function() {
    'use strict'

    // オフィシャルフラグを削除する
    if (location.search.match(/\bof=[^&]*\b/)) {
        location.search = location.search.replace(/\bof=[^&]*\b/, '')
        return
    }

    // 便利リンクを作る
    const a_myh = document.querySelector('a.myh')
    if (a_myh) {
        const li = document.createElement('li')
        li.innerHTML = `
            <a href="/tt/community/ABFavoriteGirlList/?spmode=pc">マイガ</a>
            <a href="/tt/community/ABMyAlbumShukkin/?spmode=pc">出勤</a>
            <a href="/tt/community/SBMyAlbumShukkin/?pcmode=sp" target="_blank">週間</a>
            <a href="/mypage/comeonlist/?spmode=pc" target="_blank">キテネ</a>
        `
        a_myh.parentNode.parentNode.insertBefore(li, null)
    }

    const div_myg = document.querySelectorAll('div.header-wrap-menu-item')[1]
    if (div_myg) {
        const div = document.createElement('div')
        div.className = 'header-wrap-menu-item'
        div.innerHTML = `
            <a href="/tt/community/ABMyAlbumShukkin/?spmode=pc">出勤</a>
            ・<a href="/tt/community/SBMyAlbumShukkin/?pcmode=sp" target="_blank">週間</a>
            ・<a href="/mypage/comeonlist/?spmode=pc" target="_blank">キテネ</a>
        `
        div_myg.parentNode.insertBefore(div, div_myg.nextSibling)
    }

    // いろいろな画面でお気に入り数を表示する
    const configs = [
        {
            path: '/girllist/', // /girllist/attend/ も扱う
            cast_selector: 'ul.girllist li',
            get_ids: li => {
                const m = li.querySelector('a').href.match(/girlid-(\d+)/)
                return [ m[1] ]
            },
            show_selector: 'div.girllisttext',
            modify_html: (html, count) => { return html.replace('<br>', ` [${count}]<br>`) }
        },
        {
            path: '/attend/',
            cast_selector: 'div.sugunavi_wrapper a',
            get_ids: a => {
                const m = a.href.match(/girlid-(\d+)/)
                return [ m[1] ]
            },
            show_selector: 'p.year_font_size',
            modify_html: (html, count) => { return `${html} [${count}]` }
        },
        {
            path: '/ABMyAlbumShukkin/',
            cast_selector: 'div.recommend-block',
            get_ids: div => {
                const m = div.querySelector('div.recommend-block-box a').href.match(/commuid=(\d+)&girlId=(\d+)/)
                return [ m[2], m[1] ]
            },
            show_selector: 'h3.recommend-block-top-name',
            modify_html: (html, count) => { return `
                ${html}<span style="font-size: 13px; font-weight: normal;">[${count}]</span>
            `}
        },
        {
            path: '/girlid-',
            cast_selector: 'span.title_font',
            get_ids: _span => {
                const m = location.pathname.match(/girlid-(\d+)/)
                return [ m[1] ]
            },
            show_selector: 'td',
            modify_html: (html, count) => { return html.replace('〕', `〕[${count}]`) }
        }
    ]

    for (const c of configs) {
        if (!location.pathname.match(c.path)) {
            continue
        }

        let common_sid = null
        document.querySelectorAll(c.cast_selector).forEach(elm => { try {
            let [ gid, sid ] = c.get_ids(elm)
            sid ||= common_sid ||= function() {
                for (const s of document.querySelectorAll('script')) {
                    const m = s.innerText.match(/'shop_id':'(\d+)'/)
                    if (m) { return m[1] }
                }
            }()
            fetch(`https://www.cityheaven.net/api/myheaven/v1/getgirlfavcnt/?girl_id=${gid}&commu_id=${sid}`)
                .then(res => res.json()).then(fav => {
                    const show_elm = elm.querySelector(c.show_selector)
                    show_elm.innerHTML = c.modify_html(show_elm.innerHTML, fav.cnt)
                })
        } catch {} })
        break
    }
})();
