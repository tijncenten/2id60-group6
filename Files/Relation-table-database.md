User(*user_id*, name, email)

Profile(*profile_id*, *user_id*)__
Like(*like_id*, date, profile_id)__
P-Like(*like_id*, date, profile_id, post_id)__
C-Like(*like_id*, date, profile_id, comment_id)__
Comment(*comment_id*, profile_id, post_id, text)__
Post(*post_id*, profile_id(Created), text)__
SharedPost(*post_id*, profile_id(Created), profile_id(by))__
NewPost(*post_id*, profile_id(Created), profile_id(On))__
AlbumPost(*post_id*, album)__
MapPost(*post_id*, map)__
