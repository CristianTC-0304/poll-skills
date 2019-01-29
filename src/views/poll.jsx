import React from 'react'
import _ from 'lodash'
import ContentPickerWidget from 'botpress/content-picker'

export default class TemplateModule extends React.Component {
  state = {
    keywords: {},
    contentId: '',
    config: {}
  }

  componentDidMount() {
    this.props.resizeBuilderWindow && this.props.resizeBuilderWindow('small')
    const getOrDefault = (propsKey, stateKey) => this.props.initialData[propsKey] || this.state[stateKey]

    if (this.props.initialData) {
      this.setState(
        {
          contentId: getOrDefault('contentId', 'contentId'),
          keywords: getOrDefault('keywords', 'keywords'),
          config: getOrDefault('config', 'config')
        },
        () => this.refreshContent()
      )
    }

    this.fetchDefaultConfig()
  }

  async refreshContent() {
    const id = this.state.contentId
    const res = await this.props.bp.axios.get(`/content/element/${id}`)
    return this.onContentChanged(res.data, true)
  }

  fetchDefaultConfig = async () => {
    const res = await this.props.bp.axios.get('/mod/poll-skills/poll/config')
    this.setState({ defaultConfig: res.data })
  }

  componentDidUpdate() {
    this.updateParent()
  }

  updateParent = () => {
    this.props.onDataChanged &&
      this.props.onDataChanged({
        contentId: this.state.contentId,
        keywords: this.state.keywords,
        config: this.state.config
      })
    if (this.polls && this.polls.length > 1) {
      this.props.onValidChanged && this.props.onValidChanged(true)
    }
  }

  onContentChanged = (element, force = false) => {
    console.log('entro a onContentChanged', element)
    if (element && (force || element.id !== this.state.contentId)) {
      this.polls = _.get(element, 'formData.polls') || [] //CHANGED
      const initialKeywords = element.id === this.state.contentId ? this.state.keywords : {}
      const keywords = this.polls.reduce((acc, v) => {
        console.log('acc initial', acc)
        console.log('data onContentChanged', v)
        if (!acc[v.name_file]) {
          acc[v.name_file] = { message: _.uniq([v.question]), question_type: _.uniq([v.question_type])} 
        }
        console.log('acc return', acc)
        return acc
      }, initialKeywords)
      this.setState({ contentId: element.id, keywords: keywords })
    }
  }

  getContentElement() {
    return typeof this.state.config.contentElement === 'string'
      ? this.state.config.contentElement
      : this.state.defaultConfig && this.state.defaultConfig.defaultContentElement
  }

  renderBasic() {
    /*const matchingSection =
    this.choices && this.choices.length ? (
      this.renderMatchingSection()
    ) : (
      <Alert bsStyle="warning">No choices available. Pick a content element that contains choices.</Alert>
    )*/

  const contentPickerProps = {}
  const contentElement = this.getContentElement()
  if (contentElement && contentElement.length) {
      console.log('contentElement', contentElement)
    contentPickerProps.categoryId = contentElement
  }

  return (
      console.log('contentId', this.state.contentId),
    <div>
      <p>
        <strong>Change the question and choices</strong>
      </p>
      <div>
        <ContentPickerWidget
          {...contentPickerProps}
          itemId={this.state.contentId}
          onChange={this.onContentChanged}
          placeholder="Pick content (question and polls)"
        />
      </div>
      <p>
        <strong>Define how choices are matched</strong>
      </p>
    </div>
  )
  }

  render() {
    return (
      console.log('poll skills'),
      this.renderBasic()
    )
  }
}
