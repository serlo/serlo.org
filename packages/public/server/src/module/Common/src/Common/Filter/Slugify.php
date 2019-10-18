<?php
/**
 * This file is part of Serlo.org.
 *
 * Copyright (c) 2013-2019 Serlo Education e.V.
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
 * @copyright Copyright (c) 2013-2019 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/serlo.org for the canonical source repository
 */
namespace Common\Filter;

use Zend\Filter\FilterInterface;

class Slugify implements FilterInterface
{
    /**
     * @param string $text
     * @return bool|mixed
     */
    protected static function slugify($text)
    {
        $text = preg_replace("~ +~u", '-', $text);
        // replace non letter or digits
        $text = preg_replace('~[^\\pL\\pM\d-]+~u', '', $text);
        // trim
        $text = trim($text, '-');
        $text = strtolower($text);
        if (empty($text)) {
            return false;
        }
        return $text;
    }

    /**
     * @param string $str
     * @param string $delimiter
     * @return mixed|string
     */
    protected static function toAscii($str, $delimiter = '-')
    {
        $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
        $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
        $clean = strtolower(trim($clean, '-'));
        $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);

        return $clean;
    }

    /**
     * {@inheritDoc}
     */
    public function filter($value)
    {
        return self::slugify($value);
    }
}
