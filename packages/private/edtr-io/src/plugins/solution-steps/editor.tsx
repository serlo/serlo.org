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
import { useScopedSelector } from '@edtr-io/core'
import { AddButton } from '@edtr-io/editor-ui'
import { getFocusPath } from '@edtr-io/store'
import { faTrashAlt, Icon } from '@edtr-io/ui'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import * as React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import { SolutionStepsProps } from '.'
import {
  AddButtonsComponent,
  findPairs,
  dragContent,
  RenderControls
} from './helper'
import { SolutionStepsRenderer } from './renderer'
import {
  useHasFocusSelector,
  SemanticSolutionTypes,
  additionalsGuideline,
  additionalsLabel,
  Container,
  Content,
  ControlButton,
  Controls,
  explanationGuideline,
  introductionGuideline,
  introductionLabel,
  Overlay,
  stepGuideline,
  strategyGuideline,
  strategyLabel
} from '../semantic-plugin-helpers'

export function SolutionStepsEditor(props: SolutionStepsProps) {
  const { state, editable } = props
  const { additionals, strategy, solutionSteps } = state
  const focusPath = useScopedSelector(getFocusPath())
  const pluginFocused = useHasFocusSelector(props.id)

  const [introductionHelpVisible, setIntroductionHelp] = React.useState(false)
  const [strategyHelpVisible, setStrategyHelp] = React.useState(false)
  const [stepHelpVisible, setStepHelp] = React.useState(false)
  const [additionalsHelpVisible, setAdditionalsHelp] = React.useState(false)

  return editable && pluginFocused ? (
    <DragDropContext onDragEnd={result => dragContent(result, state)}>
      <React.Fragment>
        <Content type={SemanticSolutionTypes.introduction} boxfree>
          {state.introduction.render({
            config: { placeholder: introductionLabel }
          })}
        </Content>
        <Controls
          show={
            (focusPath && focusPath.includes(state.introduction.id)) || false
          }
        >
          <ControlButton
            onMouseDown={() => {
              setIntroductionHelp(true)
            }}
          >
            <Icon icon={faQuestion} />
          </ControlButton>
        </Controls>
        <Overlay
          content={introductionGuideline}
          open={introductionHelpVisible}
          setOpen={setIntroductionHelp}
        />
        {strategy.defined ? null : (
          <AddButton
            title={strategyLabel}
            onClick={() => {
              strategy.create()
            }}
          >
            Lösungsstrategie (optional)
          </AddButton>
        )}
      </React.Fragment>
      {strategy.defined ? (
        <div style={{ position: 'relative' }}>
          <Content type={SemanticSolutionTypes.strategy}>
            {strategy.render()}
          </Content>
          <Controls
            show={(focusPath && focusPath.includes(strategy.id)) || false}
          >
            <ControlButton
              onMouseDown={() => {
                strategy.remove()
              }}
            >
              <Icon icon={faTrashAlt} />
            </ControlButton>
            <ControlButton
              onMouseDown={() => {
                setStrategyHelp(true)
              }}
            >
              <Icon icon={faQuestion} />
            </ControlButton>
          </Controls>
          <Overlay
            content={strategyGuideline}
            open={strategyHelpVisible}
            setOpen={setStrategyHelp}
          />
        </div>
      ) : null}

      <AddButtonsComponent {...props} index={-1} id="" />

      <Droppable droppableId="default" direction="vertical">
        {(provided: any) => {
          const pairedArray = findPairs(solutionSteps)
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {pairedArray.map((row, index) => {
                const solutionStepLeft = row.val1.content
                const solutionStepRight = row.val2
                  ? row.val2.content
                  : undefined
                const solutionStepIndexLeft = row.val1.solutionStepIndex
                const solutionStepIndexRight = row.val2
                  ? row.val2.solutionStepIndex
                  : -1
                return (
                  <Draggable
                    key={index}
                    draggableId={solutionStepLeft.content.id}
                    index={index}
                  >
                    {(provided: any) => {
                      const show =
                        (focusPath &&
                          (focusPath.includes(solutionStepLeft.content.id) ||
                            (solutionStepRight &&
                              focusPath.includes(
                                solutionStepRight.content.id
                              )))) ||
                        false
                      return (
                        <React.Fragment key={solutionStepLeft.content.id}>
                          <Container {...provided.draggableProps}>
                            <Content
                              type={
                                solutionStepLeft.type
                                  .value as SemanticSolutionTypes
                              }
                              isHalf={solutionStepLeft.isHalf.value}
                            >
                              {solutionStepLeft.content.render()}
                            </Content>
                            {solutionStepRight ? (
                              <Content
                                type={
                                  solutionStepRight.type
                                    .value as SemanticSolutionTypes
                                }
                                isHalf={solutionStepRight.isHalf.value}
                              >
                                {solutionStepRight.content.render()}
                              </Content>
                            ) : null}
                            <RenderControls
                              state={state}
                              index={row.val1.solutionStepIndex}
                              provided={provided}
                              showHelp={setStepHelp}
                              showButtons={show}
                            />
                            <Overlay
                              open={stepHelpVisible}
                              setOpen={setStepHelp}
                              content={
                                solutionStepRight ? (
                                  <React.Fragment>
                                    {stepGuideline}
                                    {explanationGuideline}
                                  </React.Fragment>
                                ) : solutionStepLeft.type.value ===
                                  SemanticSolutionTypes.explanation ? (
                                  explanationGuideline
                                ) : (
                                  stepGuideline
                                )
                              }
                            ></Overlay>
                          </Container>
                          {show ? (
                            <AddButtonsComponent
                              {...props}
                              id={solutionStepLeft.content.id}
                              optionalID={
                                solutionStepRight
                                  ? solutionStepRight.content.id
                                  : undefined
                              }
                              index={
                                solutionStepRight
                                  ? solutionStepIndexRight
                                  : solutionStepIndexLeft
                              }
                            />
                          ) : null}
                        </React.Fragment>
                      )
                    }}
                  </Draggable>
                )
              })}
              {additionals.defined ? null : (
                <AddButton
                  title={additionalsLabel}
                  onClick={() => {
                    additionals.create()
                  }}
                >
                  Ergänzung (optional)
                </AddButton>
              )}
              {additionals.defined ? (
                <div style={{ position: 'relative' }}>
                  <Content type={SemanticSolutionTypes.additionals}>
                    {additionals.render()}
                  </Content>
                  <Controls>
                    <ControlButton
                      onClick={() => {
                        additionals.remove()
                      }}
                    >
                      <Icon icon={faTrashAlt} />
                    </ControlButton>
                  </Controls>
                  <Overlay
                    content={additionalsGuideline}
                    open={additionalsHelpVisible}
                    setOpen={setAdditionalsHelp}
                  />
                </div>
              ) : null}
            </div>
          )
        }}
      </Droppable>
    </DragDropContext>
  ) : (
    <SolutionStepsRenderer {...props} />
  )
}
