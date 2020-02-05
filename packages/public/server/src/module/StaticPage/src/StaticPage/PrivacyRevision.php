<?php
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
namespace StaticPage;

class PrivacyRevision
{
    /**
     * @var string
     */
    private $id;

    /**
     * @var bool
     */
    private $current;


    public function __construct(string $revision, bool $current)
    {
        $this->id = $revision;
        $this->current = $current;
    }

    public function isArchived()
    {
        return !$this->current;
    }

    public function getUrl()
    {
        return $this->current ? '/privacy' : '/privacy/archiv/' . $this->id;
    }

    public function getDate()
    {
        $formatter = new \IntlDateFormatter('de_DE', \IntlDateFormatter::LONG, \IntlDateFormatter::NONE);

        return $formatter->format(new \DateTime($this->id));
    }

    public function getLabel()
    {
        return $this->current ? 'Aktuelle Version' : $this->getDate();
    }
}
