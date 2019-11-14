import React, { ReactEventHandler } from 'react'
import classnames from 'classnames'
import socket from '../socket'
import { AddStreamPayload } from '../actions/StreamActions'

export interface VideoProps {
  videos: Record<string, unknown>
  onClick: (userId: string) => void
  active: boolean
  stream?: AddStreamPayload
  userId: string
  muted: boolean
  mirrored: boolean
}

export default class Video extends React.PureComponent<VideoProps> {
  videoRef = React.createRef<HTMLVideoElement>()

  static defaultProps = {
    muted: false,
    mirrored: false,
  }
  handleClick: ReactEventHandler<HTMLVideoElement> = e => {
    const { onClick, userId } = this.props
    this.play(e)
    onClick(userId)
  }
  play: ReactEventHandler<HTMLVideoElement> = e => {
    e.preventDefault();
    (e.target as HTMLVideoElement).play()
  }
  componentDidMount () {
    this.componentDidUpdate()
  }
  componentDidUpdate () {
    const { videos, stream } = this.props
    const video = this.videoRef.current!
    const mediaStream = stream && stream.stream || null
    const url = stream && stream.url
    console.log('stream', stream)
    if ('srcObject' in video as unknown) {
      if (video.srcObject !== mediaStream) {
        console.log('setting srcObject')
        video.srcObject = mediaStream
      }
    } else if (video.src !== url) {
      console.log('setting src')
      video.src = url || ''
    }
    videos[socket.id] = video
  }
  render () {
    const { active, mirrored, muted } = this.props
    const className = classnames('video-container', { active, mirrored })
    return (
      <div className={className}>
        <video
          id={`video-${socket.id}`}
          autoPlay
          onClick={this.handleClick}
          onLoadedMetadata={this.play}
          playsInline
          ref={this.videoRef}
          muted={muted}
        />
      </div>
    )
  }
}
