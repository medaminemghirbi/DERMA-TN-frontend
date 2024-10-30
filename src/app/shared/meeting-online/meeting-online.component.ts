import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
declare var apiRTC: any;
@Component({
  selector: 'app-meeting-online',
  templateUrl: './meeting-online.component.html',
  styleUrls: ['./meeting-online.component.css']
})
export class MeetingOnlineComponent implements OnInit {
  role: any;
  constructor(
    private http: HttpClient,
    private Auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.role = this.Auth.getRole();
    this.getOrcreateConversation();
    this.checkRoomCode();
    
  }

  get conversationNameFc() {
    return this.activatedRoute.snapshot.params['code'];
  }

  checkRoomCode() {
    const roomCode = this.conversationNameFc; // Get the room code from the route

    // Make a request to the backend to check if the room code exists
    this.http.get(environment.urlBackend + `api/v1/code_room_exist?code=${roomCode}`).subscribe(
      (response: any) => {
      },
      (error) => {
        if (error.status === 422) {
          this.router.navigate(['/**']); // Adjust this route as needed
        } else {
          console.error('Error fetching consultation:', error);
        }
      }
    );
  }
  getOrcreateConversation() {
    var localStream: null = null;
    //==============================
    // 1/ CREATE USER AGENT
    //==============================
    var ua = new apiRTC.UserAgent({
      uri: 'apzkey:myDemoApiKey'
    });
    //==============================
    // 2/ REGISTER
    //==============================
    ua.register().then((session:any) => {

      //==============================
      // 3/ CREATE CONVERSATION
      //==============================
      const conversation = session.getConversation(this.conversationNameFc.value);
      //==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      //==========================================================
      conversation.on('streamListChanged', (streamInfo: any) => {
        console.log("streamListChanged :", streamInfo);
        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {
            conversation.subscribeToMedia(streamInfo.streamId)
              .then((stream:any) => {
                console.log('subscribeToMedia success');
              }).catch((err:any) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      //=====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
      //=====================================================
      conversation.on('streamAdded', (stream: any) => {
        stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
      }).on('streamRemoved', (stream: any) => {
        stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
      });

      //==============================
      // 5/ CREATE LOCAL STREAM
      //==============================
      ua.createStream({
        constraints: {
          audio: true,
          video: true
        }
      })
        .then((stream: any) => {

          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media', {}, true);

          //==============================
          // 6/ JOIN CONVERSATION
          //==============================
          conversation.join()
            .then((response: any) => {
              //==============================
              // 7/ PUBLISH LOCAL STREAM
              //==============================
              conversation.publish(localStream);
            }).catch((err:any) => {
              console.error('Conversation join error', err);
            });

        }).catch((err:any) => {
          console.error('create stream error', err);
        });
    });
  }

}
