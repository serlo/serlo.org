<?php
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

namespace Api\Controller;

use Api\Exception\AuthorizationException;
use Api\Service\AuthorizationService;
use Common\Traits\ControllerHelperTrait;
use Common\Utils;
use Zend\Http\Response;
use Zend\Json\Json;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class AbstractApiController extends AbstractActionController
{
    /** @var AuthorizationService */
    protected $authorizationService;
    /** @var Response */
    protected $response;

    use ControllerHelperTrait;

    public function __construct(AuthorizationService $authorizationService)
    {
        $this->authorizationService = $authorizationService;
    }

    /**
     * @return JsonModel | void
     */
    protected function assertAuthorization()
    {
        try {
            $this->authorizationService->assertAuthorization();
        } catch (AuthorizationException $exception) {
            return $this->forbiddenResponse('Invalid authorization header');
        }
    }

    protected function getRequestBody(array $validators): array
    {
        $data = Json::decode(
            $this->getRequest()->getContent(),
            Json::TYPE_ARRAY
        );
        if (!is_array($data)) {
            throw new \TypeError();
        }
        $keys = Utils::array_union(array_keys($data), array_keys($validators));
        $isValid = Utils::array_every(function ($key) use ($data, $validators) {
            return isset($validators[$key]) &&
                isset($data[$key]) &&
                $validators[$key]($data[$key]);
        }, $keys);

        if ($isValid) {
            return $data;
        } else {
            throw new \TypeError();
        }
    }
}
