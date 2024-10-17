import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd



# Spotify API credentials
client_id = ''
client_secret = ''

# Authentifizierung
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

# holt Top-Ten-Songs   
def get_top_ten_playlist_songs(country, playlist_id, all_tracks):

    # playlist details
    playlist = sp.playlist_tracks(playlist_id)

    # top ten tracks from the playlist
    top_ten_tracks = playlist['items'][:10]

    #fügt für jeden Song gewisse Details dem Dataframe hinzu
    for rank, track in enumerate(top_ten_tracks, start = 1):
        artists = [artist['name'] for artist in track['track']['artists']]
        artist_names = ', '.join(artists)

        album_images = track['track']['album']['images']
        cover = album_images[0]['url'] if album_images else None

        track_info = {
            'Country': country,
            'Rank': rank,
            'Song': track['track']['name'],
            'Artists': artist_names,
            'Album': track['track']['album']['name'],
            'Cover': cover,
            'Link': track['track']['external_urls']['spotify']
            }
        
        all_tracks.loc[len(all_tracks.index)] = track_info          # Details werden in neue Zeile des DataFrames geschrieben
    
    return all_tracks

#holt Top-Five-Alben
def get_top_five_albums(country, album_id, all_albums):

    # Playlist-Details
    playlist = sp.playlist_tracks(album_id)

    # Top-5-Alben
    top_five_albums = playlist['items'][:5]

    for rank, album in enumerate(top_five_albums, start = 1):
        artists = [artist['name'] for artist in album['track']['artists']]
        artist_names = ', '.join(artists)

        album_images = album['track']['album']['images']
        cover = album_images[0]['url'] if album_images else None

        album_info = {
            'Country': country,
            'Rank': rank,
            'Name': album['track']['album']['name'],
            'Artists': artist_names,
            'Cover': cover,
            'Link': album['track']['album']['external_urls']['spotify']
        }
        all_albums.loc[len(all_albums.index)] = album_info
    
    return all_albums

# ID of every available European country
playlist_ids = {'Austria': '37i9dQZEVXbKNHh6NIXu36', 'Hungary': '37i9dQZEVXbNHwMxAkvmF8', 
                'Ukraine': '37i9dQZEVXbKkidEfWYRuD',  
                'Czech Republic': '37i9dQZEVXbIP3c3fqVrJY', 'Spain': '37i9dQZEVXbNFJfN1Vw8d9',
                'Slovakia': '37i9dQZEVXbKIVTPX9a2Sb', 'Switzerland': '37i9dQZEVXbJiyhoAPEfMK', 
                'Sweden': '37i9dQZEVXbLoATJ81JYXz', 'Romania': '37i9dQZEVXbNZbJ6TZelCq', 
                'Portugal': '37i9dQZEVXbKyJS56d1pgi', 'Poland': '37i9dQZEVXbN6itCcaL3Tt', 
                'Norway': '37i9dQZEVXbJvfa0Yxg7E7', 'Netherlands': '37i9dQZEVXbKCF6dqVpDkS', 
                'Luxembourg': '37i9dQZEVXbKGcyg6TFGx6', 'Lithuania': '37i9dQZEVXbMx56Rdq5lwc', 
                'Latvia': '37i9dQZEVXbJWuzDrTxbKS', 'Italy': '37i9dQZEVXbIQnj7RRhdSX', 
                'Iceland': '37i9dQZEVXbKMzVsSGQ49S', 'Ireland': '37i9dQZEVXbKM896FDX8L1', 
                'UK': '37i9dQZEVXbLnolsZ8PSNw', 'Greece': '37i9dQZEVXbJqdarpmTJDL', 
                'France': '37i9dQZEVXbIPWwFssbupI', 'Finland': '37i9dQZEVXbMxcczTSoGwZ', 
                'Estonia': '37i9dQZEVXbLesry2Qw2xS', 'Denmark': '37i9dQZEVXbL3J0k32lWnN', 
                'Germany': '37i9dQZEVXbJiZcmkrIHGU', 'Bulgaria': '37i9dQZEVXbNfM2w2mq1B8', 
                'Belgium': '37i9dQZEVXbJNSeeHswcKB'
                }
 
# ID of every available European country
album_ids = {'Belarus': '37i9dQZEVXbJDrM2kHUvXB', 'Belgium': '37i9dQZEVXbKF4u0mBlFbq',
             'Germany': '37i9dQZEVXbO9Lz2M3B3ZU', 'Denmark': '37i9dQZEVXbNTAuL1NXk5h',
             'Finland': '37i9dQZEVXbOgOMAFdGAKJ', 'France': '37i9dQZEVXbIVRVf4D2xNM',
             'UK': '37i9dQZEVXbJKHWJGLA6O8', 'Ireland': '37i9dQZEVXbJkZyXwHaN2k',
             'Italy': '37i9dQZEVXbJCL6OtaTk7r', 'Netherlands': '37i9dQZEVXbLJpJLnezEOe',
             'Norway': '37i9dQZEVXbJP8lKdeEAqL', 'Poland': '37i9dQZEVXbKnswM6yj2sN',
             'Romania': '37i9dQZEVXbLvllPbys6D5', 'Sweden': '37i9dQZEVXbLwMdKRorywz',
             'Switzerland': '37i9dQZEVXbO4grc4a0ZsT', 'Slovakia': '37i9dQZEVXbL8HJXKJcO9B',
             'Spain': '37i9dQZEVXbIUhJtHbZmqA', 'Czech Republic': '37i9dQZEVXbNFQE3FkTLcX',
             'Ukraine': '37i9dQZEVXbNY0tzaHkjJH', 'Hungary': '37i9dQZEVXbJNQU7dL9lBc',
             'Austria': '37i9dQZEVXbLQ6a6fWjd1F'
             }

# erstellt zwei DataFrames
all_tracks = pd.DataFrame(columns=['Country', 'Rank', 'Song', 'Artists', 'Album','Cover', 'Link'])
all_albums = pd.DataFrame(columns=['Country', 'Rank', 'Name', 'Artists', 'Cover', 'Link'])

# holt Top-Ten-Songs jeden Landes
for country, id in playlist_ids.items():
    get_top_ten_playlist_songs(country, id, all_tracks)

# holt Top-Five-Alben jeden Landes
for country, id in album_ids.items():
    get_top_five_albums(country, id, all_albums)

# schreibt Dataframes in CSV
all_tracks.to_csv('song_data.csv', sep = '\t', index = False)
all_albums.to_csv('album_data.csv', sep = '\t', index = False)


'''
automatisches Aktualisieren:

import schedule
import time

def top_ten_song():

    all_tracks = pd.DataFrame(columns=['Country', 'Rank', 'Song', 'Artists', 'Album','Cover', 'Link'])

    for country, id in playlist_ids.items():
        get_top_ten_playlist_songs(country, id, all_tracks)
    
    all_tracks.to_csv('song_data.csv', sep = '\t', index = False)

def top_five_albums():

    all_albums = pd.DataFrame(columns=['Country', 'Rank', 'Name', 'Artists', 'Cover', 'Link'])
    
    for country, id in album_ids.items():
        get_top_five_albums(country, id, all_albums)
    
    all_albums.to_csv('album_data.csv', sep = '\t', index = False)

schedule.every().day.at("00:00").do(top_ten_songs)          # Songs werden täglich um Mitternacht aktualisiert
schedule.every().monday.at("00:00").do(top_five_albums)     # Alben werden wöchentlich am Montag um Mitternacht aktualisiert

# Endlosschleife
while True:
    schedule.run_pending()
    time.sleep(1)
'''