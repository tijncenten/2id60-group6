import React from 'react';
import View from './View.jsx';
import ChatList from '../components/chat/ChatList.jsx';
import Chat from '../components/chat/Chat.jsx';
import apiHandler from '../../js/apiHandler';

export default class ChatView extends View {
  constructor(props) {
    super(props);
    this.title = "Chats";

    this.state = {
      selected: undefined,
      chatDrawer: false,
      chatVisible: false,
      chats: null
    };

    this.calculateWidth = this.calculateWidth.bind(this);
    this.selectChat = this.selectChat.bind(this);
    this.update = this.update.bind(this);

    window.addEventListener("resize", this.calculateWidth);
    this._mounted = false;
  }

  componentDidMount() {
    super.componentDidMount();
    this._mounted = true;
    this.calculateWidth();
    this.update();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  calculateWidth() {
    if(!this._mounted) return;
    const view = document.querySelector(".chat-view");
    if(view === null || view === undefined) {
      return;
    }
    const screenWidth = view.offsetWidth;
    if (screenWidth >= 950) {
      this.setState({chatDrawer: false});
    } else {
      this.setState({chatDrawer: true});
    }
  }

  selectChat(chat) {
    this.setState({selected: chat, chatVisible: true});
  }

  update() {
    apiHandler.getChats().then(result => {
      this.setState({
        chats: result
      });
    });
  }


  render() {
    const selectedId = this.state.selected === undefined ? -1 : this.state.selected.id;
    let className = "chat-view";
    className += this.state.chatDrawer ? "" : " chat-2-column";
    return (
      <div className={className}>
        <ChatList items={this.state.chats} onItemClick={this.selectChat} selectedId={selectedId} />
        <Chat isDrawer={this.state.chatDrawer} visible={this.state.chatVisible} chat={this.state.selected} />
      </div>
    );
  }
}
