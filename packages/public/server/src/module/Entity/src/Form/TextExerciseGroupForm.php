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
namespace Entity\Form;

use Entity\Form\Element\Changes;
use Csrf\Form\Element\CsrfToken;
use Common\Form\Element\EditorState;
use License\Entity\LicenseInterface;
use License\Form\AgreementFieldset;
use Zend\Form\Form;
use Zend\InputFilter\InputFilter;

class TextExerciseGroupForm extends Form
{
    public function __construct(LicenseInterface $license)
    {
        parent::__construct('text-exercise-group');
        $this->add(new CsrfToken());

        $this->setAttribute('method', 'post');
        $this->setAttribute('class', 'clearfix');

        $this->add((new EditorState('content'))->setLabel('Content:'));
        $this->add(new Changes());
        $this->add(new AgreementFieldset($license));
        $this->add(new Controls());
        $this->add([ "name" => "cohesive", "required" => false]);

        $inputFilter = new InputFilter('text-exercise-group');
        $inputFilter->add(['name' => 'content', 'required' => true]);
        $this->setInputFilter($inputFilter);
    }
}
