/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2013-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
/* global require, window, GGBApplet */
import $ from 'jquery'

import Common from '../../modules/common'
import '../../modules/content'
import t from '../../modules/translator'

var Injections
var cache = {}
var ggbApplets = {}
var ggbAppletsCount = 0
var $geogebraTemplate = $(
  '<article class="geogebraweb" data-param-width="700" data-param-height="525" data-param-usebrowserforjs="true" data-param-enableRightClick="false"></article>'
)

// terrible geogebra oninit handler..
// that doesnt work.....
window.ggbOnInit = function (id) {
  if (ggbApplets[id]) {
    ggbApplets[id]()
  }
}

Injections = function () {
  var totalInjectionsCount = $(this).length

  return $(this).each(function () {
    var $that = $(this)
    var $a = $('> a', $that)
    var title = $a.text()
    var href = $a.attr('href')

    if (!href) {
      return true
    }

    function initGeogebraApplet(xml) {
      var ggbAppletID = 'ggbApplet' + ggbAppletsCount
      var $clone = $geogebraTemplate.clone()

      ggbAppletsCount += 1

      $clone.attr('data-param-id', ggbAppletID)
      // initialize geogebra applet with an empty dummy document
      // otherwise it wont initialize and we will never be able
      // to call the setXML method..
      $clone.attr(
        'data-param-ggbbase64',
        'UEsDBBQACAgIAD10R0QAAAAAAAAAAAAAAAAWAAAAZ2VvZ2VicmFfamF2YXNjcmlwdC5qc0srzUsuyczPU0hPT/LP88zLLNHQVKiuBQBQSwcI1je9uRkAAAAXAAAAUEsDBBQACAgIAD10R0QAAAAAAAAAAAAAAAAMAAAAZ2VvZ2VicmEueG1srVZtb9s2EP6c/oqDPqc2qTfbgZyiLVCgQBYUSzcU/UZJtMxZFgWRsp2iP353pGQ7Lx2WZXFk6njPvfLu6OzdYVvDTnZG6WYZ8AkLQDaFLlVTLYPert7Og3fXb7JK6krmnYCV7rbCLoN4EgcnOaQmnJEwHIy6avSt2ErTikLeFWu5FTe6ENYh19a2V9Ppfr+fjDonuqumVZVPDqYMAP1pzDIYXq5Q3QOhfeTgIWN8+u23G6/+rWqMFU0hAyBfe3X95iLbq6bUe9ir0q6XQZKmAaylqtbk/GIewJRALUbQysKqnTQoekaCKpeB3baBg4mG+Bf+DepjOAGUaqdK2S2DW3EbgO6UbOzA5IOR6Sie7ZTcez305kzEbDHDTCqj8loug5WoDYahmlWHKUQPuh5JY+9rmYtupE8O8Ev8IED9kKQLT8DHjRzGLumZ4ZMkzPtybjgAq3XttLJ/8GCgTy4MGw98GD2InvMgxce59siD+ZkHiOPwE3AJ/RIB/HQviafjgUw9OXMLZ37hA3NOXwsi0ldGFP2niPiZVX9SLzF6PMbFC0yGrzF5jPIZg2HyixhfmdpnE4u23L97npiMwpeYfNIi/9ZiNh37MxvqEsyasENerdziZHIlBwmWazqDS0iAL3CZUdmGwBOIEyT5HFJaZxBRpcYQwRwIxyOIYxKb41fsqjiFBHXR5syXM0QxJBFgVV9CGAOEDMKQ3jmEESKSBBIUIuuczEYpxCkS0RziBXpGmqiZIpRDGo2HEHGISJbPIEwhDWEWkXhMXieQEjxmEHOInSVEzSGiCPC0W22UTyWjGVq3x6S7rKmm7e2QqWG/2JZj1qx+BC91sflwTO3AkcLYcxjOzNMo9jP0waS+yGqRyxpvqTs6d4CdqKmcnYWVbiwMZ85Dv1d1ol2rwtxJa1HKwF9iJ26ElYdPiDajbWfaXSCZ7ItalUo0f2JRkApSCON94nr0eJ/wwXKhdVfe3RusFDh8l53G/uTJhJ3+4gSn3r1nRQ9ZKd4DphBU4wk7Z3BGl9f9r3nOttwdYxMHacb8Vx110JBZIj6bD7o+bbVaNfajaG3fuTsfR0JHUb1vqlq65LoOwnu22OT6cOeyGqZe19f71g0P50BefdS17gBbMEwSBAxr7leHIc+OKOYwzCHYeEyqPPL5InQIt+Z+dSg8d+/aECkfw+RsNKOMmxyo/LyFXdHQrd03yt6MhFXF5hQp4W/7bY71Nog9VMn/J5XZ9FGFZRvZNbL2ddTgSfa6N76wj8V5kfVGfhF2/b4pf5cVNuUXQWPQomoPPXlcykJtUdDvD6kTdKx/oKt+t5RVJ8cIa/dzzCfWcdl5VT/Zdqo+dXr7udl9xZp55Go2HePJTNGplkoTchzLG3mqvlIZgVO9PJfD4A1GUdDIwURaSmIAordr3blfXNi1uJKFc6jr3OEn5fXfUEsHCAggsi84BAAA2AoAAFBLAQIUABQACAgIAD10R0TWN725GQAAABcAAAAWAAAAAAAAAAAAAAAAAAAAAABnZW9nZWJyYV9qYXZhc2NyaXB0LmpzUEsBAhQAFAAICAgAPXRHRAggsi84BAAA2AoAAAwAAAAAAAAAAAAAAAAAXQAAAGdlb2dlYnJhLnhtbFBLBQYAAAAAAgACAH4AAADPBAAAAAA='
      )

      // the following doesnt work.
      ggbApplets[ggbAppletID] = function () {
        var applet = window[ggbAppletID]
        applet.setXML(xml)
      }

      $that.html($clone)

      // web();
    }

    function initGeogebraTube() {
      const materialId = href.substr(5)
      const placeholder = `
        <div style="display: flex; justify-content: center; box-sizing: border-box;
                    border: 2px #ccc solid; border-radius: 4px; padding: 10px;">
          <img src="https://cdn.geogebra.org/static/img/GeoGebra-logo.png"
               alt="GeoGebra Applet" />
        </div>`

      $that.html(placeholder)

      fetch('https://www.geogebra.org/api/json.php', {
        method: 'POST',
        body: JSON.stringify({
          request: {
            '-api': '1.0.0',
            task: {
              '-type': 'fetch',
              fields: {
                field: [{ '-name': 'width' }, { '-name': 'height' }],
              },
              filters: {
                field: [{ '-name': 'id', '#text': materialId }],
              },
              limit: { '-num': '1' },
            },
          },
        }),
      }).then((res) => {
        const iframeUrl = `https://www.geogebra.org/material/iframe/id/${materialId}`

        const data = res.json()?.responses?.response?.item
        const ratioFromData = data?.width / data?.height

        const defaultRatio = 16 / 9
        const ratio = Number.isNaN(ratioFromData) ? defaultRatio : ratioFromData
        const inversedRatio = 100 / ratio

        $that.html(`
         <div style="position: relative; padding: 0; padding-top: ${inversedRatio}%;
                     display: block; height: 0; overflow: hidden">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%;
                         height: 100%; border: none;" title="${title}"
                  scrolling="no" src="${iframeUrl}" />
         </div>
        `)
      })
    }

    function notSupportedYet($context) {
      Common.log('Illegal injection found: ' + href)
      $context.html(
        '<div class="alert alert-info">' +
          t('Illegal injection found') +
          '</div>'
      )
    }

    function handleResponse(data, contentType) {
      cache[href] = {
        data: data,
        contentType: contentType,
      }

      if (
        data.documentElement &&
        data.documentElement.nodeName === 'geogebra'
      ) {
        initGeogebraApplet(data.documentElement.outerHTML)
      } else if (contentType === 'image/jpeg' || contentType === 'image/png') {
        $that.html('<img src="' + href + '" title="' + title + '" />')
      } else {
        try {
          data = JSON.parse(data)
          if (data.response) {
            $that.html(
              '<div class="panel panel-default"><div class="panel-body">' +
                data.response +
                '</div></div>'
            )
            Common.trigger('new context', $that)
            // trigger nextjs hydration
            if (window.__NEXT_ENTRY__) {
              window.__NEXT_ENTRY__()
            }
          } else {
            notSupportedYet($that)
          }
        } catch (e) {
          notSupportedYet($that)
        }
      }
    }

    if (cache[href]) {
      handleResponse(cache[href].data, cache[href].contentType)
    }

    if (href.substr(0, 5) === '/ggt/') {
      initGeogebraTube()
      return
    }

    // by default load injections from the server
    $.ajax(href)
      .done(function () {
        handleResponse(
          arguments[0],
          arguments[2].getResponseHeader('Content-Type')
        )
      })
      .always(function () {
        totalInjectionsCount -= 1
      })
      // This error could mean that the injection is of type GeoGebraTube
      .fail(function () {
        Common.log('Could not load injection from Serlo server')
      })
  })
}

$.fn.Injections = Injections
