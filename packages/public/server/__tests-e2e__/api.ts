/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
import axios from 'axios'

import { testingServerUrl } from './_config'

describe('/api/alias/:alias', () => {
  describe('/api/alias/user/profile/:username', () => {
    test('when user exists', async () => {
      const response = await fetchPath('/api/alias/user/profile/admin')

      expect(response.data).toEqual({
        id: 1,
        instance: 'en',
        path: '/user/profile/admin',
        source: '/user/profile/admin',
        timestamp: '2014-03-01T20:36:21+01:00',
      })
    })
    
    test('when user does not exist', async () => {
      const response = await fetchPath('/api/alias/user/profile/not-existing')

      expect(response.data).toBeNull()
    })
  })
})

function fetchPath(path: string) {
  return axios.get(testingServerUrl + path)
}
