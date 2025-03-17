
import pandas as pd 
import re 

df = pd.read_csv('d3plots/socialMedia.csv')

# df1= df[['Platform', 'PostType', 'Likes']]
# smavg = df1.groupby(['Platform', 'PostType'], observed = True)['Likes'].mean().reset_index(name = 'AvgLikes')

#print(smavg)

# smavg.to_csv('socialMediaAvg.csv', index=False)

# df2 = df[['Date', 'Likes']]
# smdate = df2.groupby(['Date'], observed=True)['Likes'].mean().reset_index(name = 'AvgLikes')
# smdate['Date'] = smdate['Date'].replace((r'[a-z, A-Z]+'), "", regex= True)
# smdate['Date'] = smdate['Date'].replace((r'[\(\)]'), "", regex= True)
# smdate['Date'] = smdate['Date'].replace((r'[/]'), "", regex= True)
# print(smdate)

# smdate['Date'] = smdate['Date'].astype(int)
# print(smdate)

# smdate.to_csv('socialMediaTime.csv', index=False)

df2 = df[['Date', 'Likes']]
smdate = df2.groupby(['Date'], observed=True)['Likes'].mean().reset_index(name = 'AvgLikes')
smdate["Date"] = smdate["Date"].apply(lambda x: re.search(r"\d+/\d+/\d+", x).group())
print(smdate)

smdate.to_csv('socialMediaTime2.csv', index=False)
